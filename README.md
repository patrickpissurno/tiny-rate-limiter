# async-rate-limiter
[![npm-version](https://img.shields.io/npm/v/async-rate-limiter.svg)](https://www.npmjs.com/package/async-rate-limiter)
[![known vulnerabilities](https://snyk.io/test/github/patrickpissurno/async-rate-limiter/badge.svg)](https://snyk.io/test/github/patrickpissurno/async-rate-limiter)
[![downloads](https://img.shields.io/npm/dt/async-rate-limiter.svg)](http://npm-stats.com/~packages/async-rate-limiter)
[![license](https://img.shields.io/github/license/patrickpissurno/async-rate-limiter.svg?maxAge=1800)](https://github.com/patrickpissurno/async-rate-limiter/blob/master/LICENSE)

Allows you to easily limit outgoing API requests (and more). Dependency free!

## Install

```
npm i async-rate-limiter
```

## Importing

```js
const rateLimiter = require('async-rate-limiter');
```

## How to use

```js
async function someFunction(){
    const key = 'this can be anything'; //things that use the same key share the same bucket
    const max_token_count = 100; //how many tokens the bucket can fit
    const window_in_milliseconds = 1000; //how many milliseconds between each bucket refill

    await rateLimiter(key, max_token_count, window_in_milliseconds);

    //from here on code is guaranteed to only execute at most 100 times per second
}
```

Real world:

```js
    async function someFunction(){
        await rateLimiter('anything', 100, 1000);
        //from here on code is guaranteed to only execute at most 100 times per second
    }
```

## What is a token bucket

- Put simply: imagine you have a bucket.
- Let's say that bucket can fit at most 10 tokens.
- It also only gets refilled with them, let's say, once every second.
- As soon as you call `await rateLimiter(...)` the function execution is temporarily paused and it's put in a queue.
- One by one, as long as there are tokens in that bucket, tokens are consumed for each function that is removed from that queue and resumes execution.
- If the bucket is empty, no function will resume execution until the bucket is refilled again.

## Example usage scenario

- Imagine your code is calling an API that has a rate limiter in place (let's say 100 requests per second).
- Let's say that if you exceed that quota bad things happen.
- You can use this module to easily prevent you from ever exceeding that quota by preventing the API requests from being made in the first place (that is, only allowing 100 req/s to be made).
- This is known as outbound (or outgoing) rate limiting (which is used on the caller side), as opposed to an inbound (or incoming) rate limiter (that would instead be used on the receiver side)

Although throughout this documentation its usage's been always demonstrated with this scenario in mind, this module has nothing to do with APIs or network requests, and its usage is in no way limited to only that. Feel free to use it in anything Node.js where it could help.

At its present state, though, it does not support being used in a browser environment, due to its reliance on the presence of the `process` object.

## Dependency free and opinionated

This is a minimal implementation that doesn't rely on anything other than Node.js itself. Its code is composed of only 57 lines (including comments, JSDoc annotations and a bunch of empty lines). It's a bit opinionated and exposes an interface that's aimed at making its usage as minimal as its code footprint.

## Performance

Although it's not been benchmarked extensively, due to the way its implemented, it should not degrade performance even with a few thousand requests per second. Your mileage may vary, though. I'm open to ideas on how to push it even further.

## LICENSE

MIT License

Copyright (c) 2022 Patrick Pissurno

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
