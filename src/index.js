#!/usr/bin/env node

const fs = require('fs-extra');
const argv = process.argv.splice(2);

const rootPath = process.cwd();

const toSubGit = 'origin';
const toGit = 'local';
const gitDir = '.git';
const subGitDir = '.__originGit__';
let isLog = false;

function changeGit(to, type = '', first) {
  const stat = fs.lstatSync(to);
  if (stat && stat.isDirectory()) {
    const files = fs.readdirSync(to);
    files.forEach(async file => {
      const subPath = to + '/' + file;
      const gitSubPath = to + '/' + subGitDir;
      const gitPath = to + '/' + gitDir;
      const subStat = fs.lstatSync(subPath);
      if (subStat.isDirectory()) {
        if (file === gitDir && type === toSubGit && !first) {
          const isHave = fs.existsSync(gitSubPath);
          if (isHave) {
            fs.removeSync(gitSubPath);
            fs.remove(gitSubPath, () => {
              fs.move(gitPath, gitSubPath);
            });
          } else {
            fs.move(gitPath, gitSubPath);
          }
          if (isLog) {
            console.log('to-subGit: ' + subPath);
          }
        } else if (file === subGitDir && type === toGit && !first) {
          const isHave = fs.existsSync(gitPath);
          if (isHave) {
            fs.remove(gitPath, () => {
              fs.move(gitSubPath, gitPath);
            });
          } else {
            fs.move(gitSubPath, gitPath);
          }
          if (isLog) {
            console.log('to-git: ' + subPath);
          }
        } else {
          changeGit(subPath, type);
        }
      }
    });
  }
}

if (argv.indexOf('-l') > -1) {
  isLog = true;
}

if (argv.indexOf(toSubGit) > -1) {
  console.log('change to orgin .git files:');
  changeGit(rootPath, toSubGit, true);
  console.log('change done!')
} else if (argv.indexOf(toGit) > -1) {
  console.log('change to local .git files:');
  changeGit(rootPath, toGit, true);
  console.log('change done!')
} else {
  console.log('Please read: https://xxxx')
}