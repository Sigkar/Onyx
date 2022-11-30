# Onyx

Onyx is a neural network built in JavaScript which generates color schemes based upon a term.
This was written with zero priot knowledge or education on ML, so it's not going to be pretty.

\# TODO: Create an Onyx subdomain to display examples

## Basic Usage:

To seed Onyx as a neural network on your own, run

```
npm run seed
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

##### For installation instructions, please read documentation in the links below.

To run Onyx, you will need:

- [NodeJS](https://nodejs.org/en/)
   - [npm](https://www.npmjs.com/) - Comes packaged with NodeJS

Make sure they are installed and running:

```
node -v
   > vXX.XX.XX
npm -v
   > vX.X.X
```


### Installing

1. Install node modules and dependencies

```
npm install
```

2. Make sure all tests pass

```
npm run test
```

## Writing Tests

We use [Jest](https://jestjs.io/) to test Onyx.

Please use the documentation above to understand the framework. All tests must pass.

## Running the tests

To test Onyx, simply run:

```
npm run test
```

## Deployment / Production Build

To run production builds, run

```
npm run prod
```
*All tests will need to run before production is allowed to continue*

- This will create the following
   - Local folder for playgrounds (Add to gitignore)
   - Dist folder to create libs


## Built With

* [BrainJS](https://www.npmjs.com/package/brainjs)
* [Axios](https://www.npmjs.com/package/axios)
* [Rollup](https://www.npmjs.com/package/rollup) - *+dependencies*

## Contributing

\# TODO: Add docs for requirements to contribute to Onyx.

## Authors

* **Duncan Pierce** - [Sigkar](https://github.com/Sigkar)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

