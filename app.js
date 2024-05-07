const ExpressErorr = require('./expressError')

const express = require('express')

const app = express()

const mathFuncs = {
    'mean': function(nums){
        let sum = 0;
        for(num of nums){
            sum += num;
        }
        return (sum/nums.length).toFixed(2)
    },
    'median': function(nums){
        if (nums.length % 2 === 0){
            return nums[Math.floor(nums.length / 2) - 1];
        } else{
            return nums[Math.floor(nums.length / 2)];
        }
    },
    'mode': function(nums){
        let modeObj = {};
        let mode;
        for(num of nums){
            modeObj[num] ? modeObj[num] += 1 : modeObj[num] = 1;
            if(isNaN(modeObj[mode])){
                mode = num;
            }else if(modeObj[num] > modeObj[mode]){
                mode = num;
            } else if (modeObj[num] === modeObj[mode]){
                num > mode ? mode = num : '';
            }else{
                continue;
            }
        }
        return mode;
    },
    'all': function(nums){
        return {
            'mean': this.mean(nums),
            'median': this.median(nums),
            'mode': this.mode(nums)
        }
    }
}

app.get('/:func', (req, res, next) =>{
    const{nums} = req.query;
    try{
        if(!nums || nums.trim() === ''){
            throw new ExpressErorr("No numbers provided", 400)
        }

        for(num of nums.split(',')){
            if(isNaN(num)){
                throw new ExpressErorr(`${num} is not a number`, 400)
            }
        }

        const numbers = nums.split(',').map(Number)
        return res.send({'operation': req.params.func,
                        'value': mathFuncs[req.params.func](numbers)})
    } catch(error){
        return next(error)
    }
})

app.use((err, req, res, next) =>{

    let status = err.status || 500
    let message = err.msg

    res.status(err.status).json({
        error: {message, status}
    })
})

app.listen(3000, () =>{
    console.log('app on 3000')
})