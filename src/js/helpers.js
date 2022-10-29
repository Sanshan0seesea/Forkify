//包含几个我们重复利用的函数

import { async } from 'regenerator-runtime';

//上面这个👆是parcel给我们加进来的
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// use for fetch all urls
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    //这个race的意思是，谁先被拒绝或者实现，谁就赢了，也就是说过了timeout中设置的XX秒，那么就不会fetch
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;

    //在helper把err throw出去，这样err就能通过controller显示出去
    //为了
  }
};
