<p align="center">
  <a href="https://sm.ms/image/sKm46pk1nIFJSZH" target="_blank"><img src="https://s2.loli.net/2024/02/25/sKm46pk1nIFJSZH.webp" style="height: 300px;"></a>
</p>

  <p align="center">Campus Smart and Safe Travel Platform — For safer and smarter travel</p>

## Description

&nbsp;&nbsp;&nbsp;&nbsp;What is this? This is Youli's undergraduate graduation project, aimed at addressing the gap in off campus travel to ensure student safety. Considering the intelligent nature of the project and different school travel situations, this project was created using the Baiyun Campus of GPNU as an example. The first phase of the project is currently under construction, and more friends will join in the future to make safe travel more convenient and safe!

The entire project is divided into several sub projects for development, and of course, what you see is one of them:

- Server side: Developed using technologies such as `Nest.js`, `Redis`, and `MySQL`, mainly responsible for server side tasks of monitoring systems

- Client: `Taro` is used for multi end development of the client. The first phase of the project mainly focuses on the development of `React Native`, which is used for normal use by Android and iOS users

- Management end: Written using `Vue3+Arco UI`, using echarts for chart display in the data display section

- Large screen end: tentatively using `React+d3.js+three.js` technology for the development of large screen visualization, used to display some travel data on the large screen

## Second phase TODO

- [ ] The project is divided from a single package architecture into a multi package architecture or a monorepo architecture. The reference frameworks include qiankun, wujie, and emp3.0, which facilitate subsequent modularization and team collaboration development
- [ ] Developing HarmonyOS on the client side to meet the needs of the HarmonyOS client
- [ ] Governance of data, optimization of permission control and configuration, and further high concurrency and high reliability processing of server architecture

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod

# service function test
$ pnpm run repl
```

## License

Project is [MIT licensed](LICENSE).
