const limiters = new Map();

const pending_calls = new Set();

/**
 * 
 * @param {string} key 
 * @param {number} max_token_count maximum token count
 * @param {number} window time window (in milliseconds)
 */
async function rateLimiter(key, max_token_count, window){
    if(!limiters.has(key)){
        //init the limiter
        limiters.set(key, {
            tokens: 0,
            next_refill: null,

            /** @param {number} current_time process.uptime() */
            checkAndRefill(current_time){
                // refill the bucket
                if(this.next_refill == null || current_time > this.next_refill){
                    this.tokens = max_token_count;
                    this.next_refill = current_time + (window / 1000);
                }
            }
        });
        limiters.get(key).checkAndRefill(process.uptime());
    }

    const limiter = limiters.get(key);

    return new Promise(resolve => {
        function cb(){
            // if there are available tokens, allow the function to proceed
            if(limiter.tokens > 0){
                pending_calls.delete(cb);
                limiter.tokens -= 1;
                resolve();
                return true;
            }
            return false;
        }

        if(!cb())
            pending_calls.add(cb);
    });
}

setInterval(() => {
    const current_time = process.uptime();
    for(let limiter of limiters)
        limiter[1].checkAndRefill(current_time);
    for(let cb of pending_calls)
        cb();
}, 50);

module.exports = rateLimiter;