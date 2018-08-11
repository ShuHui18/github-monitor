import fs from 'fs';
import yaml from 'js-yaml';
import moment from 'moment';
import githubApi from './services/githubApi';
import { renderTemplate } from './helpers/templateHelper';

const gitRepos = yaml.safeLoad(fs.readFileSync(`${__dirname}/../public/gitRepos.yml`, 'utf8'));

function getExpiredTime(date1, date2) {
  const diffTime = Date.parse(date1) - Date.parse(date2);
  const duration = moment.duration(diffTime);
  return `${Math.floor(duration.asDays())}d/${Math.floor(duration.asHours() % 24)}h`;
}

function hasSha(commits, sha) {
  return commits.data.size !== 0 && commits.data.find(commit => commit.sha === sha) !== undefined;
}

async function repoReport(repo, accessToken) {
  const [developInfo, masterInfo] = await Promise.all([
    githubApi.fetchBranchInfo(repo.owner, repo.repoName, 'develop', accessToken),
    githubApi.fetchBranchInfo(repo.owner, repo.repoName, 'master', accessToken),
  ]);
  const masterCommits = await githubApi.fetchBranchCommit(repo.owner, repo.repoName, 'master', developInfo.date, accessToken);
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

async function branchCheck(event) {
  const gitReposInfo = await Promise.all(gitRepos.map(repo => repoReport(repo, event.accessToken)));
  const contents = await renderTemplate('repoList', { repos: gitReposInfo });
  return {
    statusCode: 200,
    body: contents,
    headers: { 'content-type': 'text/html' },
  };
}

async function pr(event) {
  const { owner, repoName } = event.queryStringParameters;
  const prRes = await githubApi.createPR(owner, repoName, event.accessToken);
  return {
    statusCode: 302,
    headers: { Location: prRes.data.html_url },
  };
}

export { branchCheck, pr };
