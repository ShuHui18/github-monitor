import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com/';
// const ACCESS_TOKEN = 'fa1867c11bc69bde4346af2aa076f11b88a644da';

class GitHelper {
  constructor() {
    this.githubApiUrl = GITHUB_API_URL;
    // this.accessToken = ACCESS_TOKEN;
  }
  async fetchBranchInfo(owner, repoName, branch, code) {
    const uri = `${this.githubApiUrl}repos/${owner}/${repoName}/branches/${branch}`;
    const { data } = await axios.get(uri, {
      params: {
        access_token: code,
      },
    });
    return {
      sha: data.commit.sha,
      date: data.commit.commit.committer.date,
    };
  }

  async fetchBranchCommit(owner, repoName, branch, since, code) {
    const uri = `${this.githubApiUrl}repos/${owner}/${repoName}/commits`;
    return axios.get(uri, {
      params: {
        sha: branch,
        access_token: code,
        since,
      },
    });
  }

  async createPR(owner, repoName, code) {
    const uri = `${this.githubApiUrl}repos/${owner}/${repoName}/pulls`;
    return axios.post(uri, {
      title: 'release to master',
      head: 'develop',
      base: 'master',
    }, {
      params: {
        access_token: code,
      },
    });
  }
}

export default new GitHelper();
