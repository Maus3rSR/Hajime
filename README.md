# ASKC

ASKC is Kendo management client software for competition and grade.

## Development

Simply clone down this reposity, install dependencies, and get started on your application.

The use of the [yarn](https://yarnpkg.com/) package manager is **strongly** recommended, as opposed to using `npm`.

```bash
# git clone
git clone https://framagit.org/kendo/askc.git

# install dependencies
yarn
```

### Development Scripts

```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```

## External database

If you may want to connect the software to a external database, you must use one of these drivers :
- Mariadb version >= 10.2.7
- Mysql version >= 5.7.8