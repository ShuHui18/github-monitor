import fs from 'fs';
import yaml from 'js-yaml';
import moment from 'moment';
import gitHelper from './gitHelper';
import { renderTemplate } from './templateHelper';

const gitRepos = yaml.safeLoad(fs.readFileSync(`${__dirname}/../public/gitRepos.yml`, 'utf8'));

function getExpiredTime(date1, date2) {
  const diffTime = Date.parse(date1) - Date.parse(date2);
  const duration = moment.duration(diffTime);
  return `${Math.floor(duration.asDays())}d/${Math.floor(duration.asHours() % 24)}h`;
}

function hasSha(commits, sha) {
  if (commits.data.size === 0 || commits.data.find(commit => commit.sha === sha) === undefined) {
    return false;
  }
  return true;
}

async function repoReport(repo, code) {
  const [developInfo, masterInfo] = await Promise.all([
    gitHelper.fetchBranchInfo(repo.owner, repo.repoName, 'develop', code),
    gitHelper.fetchBranchInfo(repo.owner, repo.repoName, 'master', code),
  ]);
  const masterCommits = await gitHelper.fetchBranchCommit(repo.owner, repo.repoName, 'master', developInfo.date, code);
  let prUrl;
  let expiredTime;
  let upToDate = true;
  if (!hasSha(masterCommits, developInfo.sha)) {
    expiredTime = getExpiredTime(developInfo.date, masterInfo.date);
    prUrl = `/pr?owner=${repo.owner}&repoName=${repo.repoName}`;
    upToDate = false;
  }
  return {
    name: repo.repoName,
    upToDate,
    expiredTime,
    prUrl,
  };
}

async function branchCheck(code) {
  const gitReposInfo = await Promise.all(gitRepos.map( repo => repoReport(repo, code)));
  return renderTemplate('repoList', { repos: gitReposInfo });
}

async function pr(req, res) {
  const { owner, repoName } = req.query;
  const prRes = await gitHelper.createPR(owner, repoName);
  res.redirect(prRes.data.html_url);
}

export { branchCheck, pr };
