# Contributing

:pray: First off, thank your very much for considering contributing to **Hajime**. It's people like you that make **Hajime** such a great software. :heart:

## Where do I go from here?

If you have noticed a :bug: or have a **feature request**, [submit an issue][github-issue-page] as you please! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

If you have a **general question** about **Hajime**, [you can send me an email][author-email].

Also be sure to take note of our [code of conduct][code-of-conduct].

## Fork & create a branch

If this something you can contribute, then [fork Hajime][repo-fork] and create a branch with a descriptive name.

A good branch name would be (where issue #123 is the ticket you're working on):
```
git chekout -b 123-add-japanese-translations
```

At this point you add code!

## Make a Pull Request (PR)

At this point, you should switch back to your master branch and make sure it's up to date with **Hajime**'s master branch:

```
git remote add upstream git@github.com:Maus3rSR/Hajime.git
# or with https git remote add upstream https://github.com/Maus3rSR/Hajime.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```
git checkout 123-add-japanese-translations
git rebase master
git push --set-upstream origin 123-add-japanese-translations
```

Finally, go to GitHub and [make a Pull Request][repo-pr] :sparkles:

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of good resources but here's the suggested workflow:

```
git checkout 123-add-japanese-translations
git pull --rebase upstream master
git push --force-with-lease 123-add-japanese-translations
```

# What we currently need most

> :warning: **Main author note**: The project is very young and still need a lot of preparation, development and documentation improvements which will allow the project to be pleasant for any developer wanting to contribute to it. I am sorry if it is not.

* Get the MVP done (see the roadmap in [README.md][readme])
* Changelog maintenance
* Semver convention
* Contribution informations for maintainers about **Merging a PR** and **Shipping a version**
* Conventions & code quality check
* Unit testing and code coverage
* CI/CD

[//]: # (List of reference)
[code-of-conduct]: CODE_OF_CONDUCT.md
[readme]: README.md
[repo-fork]: https://help.github.com/en/github/getting-started-with-github/fork-a-repo
[repo-pr]: https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request
[author-email]: mailto://unfricht.kevin@hotmail.fr
[github-issue-page]: https://github.com/Maus3rSR/Hajime/issues