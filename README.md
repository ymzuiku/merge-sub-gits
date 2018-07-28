# 提交包含子.git 文件的项目

## 安装

首先得确保当前有`Nodejs`环境

```sh
npm install -g merge-sub-gits
```


## 原理及命令

思路很简单:
- 当git提交或拉取之前,把子git项目的`.git`文件夹重命名为`.__originGit__`文件夹,
- 当提交或拉取之后, 把`.__originGit__`文件夹重命名回`.git`

#### shell 命令

```sh
# 遍历当前目录子文件,把所有 .git 重命名为 .__originGit__
merge-sub-gits origin -l 

# 遍历当前目录子文件,把所有 .__originGit__ 重命名回 .git
merge-sub-gits local

# 打印重命名日志
merge-sub-gits xxx -l 
```

## 具体使用方法

#### 提交项目

```sh
merge-sub-gits origin -l #遍历当前目录子文件,把所有 .git 重命名为 .__originGit__
git add .
git commit -m 'xxx'
git push
merge-sub-gits local #遍历当前目录子文件,把所有 .__originGit__ 重命名回 .git
```

其中添加 `-l` 参数会打印重命名日志

#### 拉取项目

```sh
merge-sub-gits 'origin' -l
git pull
merge-sub-gits 'local'
```

## 为以上操作设定`shell`快捷函数

每次都需要使用 `merge-sub-gits` 命令包括 git 提交操作很是繁琐, 我们可以在`~/.bash_profile`文件中添加以下内容:

```sh
# 递归修改子git项目, 从根git项目统一提交
function merge-sub-push(){
  merge-sub-gits 'origin' -l
  git add .
  if [ "$1" == "" ];then
    git commit -m "no commit message"
  else 
    git commit -m "$1 $2 $3 $4 $5 $6 $7 $8 $9"
  fi
  git push
  merge-sub-gits 'local'
}

# 拉取所有项目
function merge-sub-pull(){
  merge-sub-gits 'origin'
  git pull
  merge-sub-gits 'local' -l
}
```

#### 然后平时直接使用以下命令提交:

```sh
# 提交
merge-sub-push 修复了以下bug 1.xxx 2.xxx

# 拉取
merge-sub-pull
```

## 修复已屏蔽的子git项目

如果曾经在根git项目中使用过`git commit`, 会把子git项目标记为忽略提交
这种情况需要清空git记录, 使用之前我们在`.bash_profile`设定的方法:

```sh
# 从当前分支替换并清空master分支
git checkout --orphan latest_master
merge-sub-gits 'origin' -l
git add .
git commit -m "clear master"
git branch -D master
git branch -m master
git push -f origin master
merge-sub-gits 'local'
```
