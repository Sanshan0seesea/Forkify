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

//因为getJSON和sendJSON都差不多，所以要改写成一个

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', //只有这样写，API才能理解我们需要发送的是JSON格式
          },
          body: JSON.stringify(uploadData), //需要用JSON.stringify把uploadData处理成JSON格式
        })
      : fetch(url);

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
  //如果真的有uploadData，那么就是send，没有的话就是getJSON
};

/*
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

//getJSON和sendJSON都是一个模板，因为是一个意思

export const sendJSON = async function (url, uploadData) {
  //这个函数需要两个输入
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', //只有这样写，API才能理解我们需要发送的是JSON格式
      },
      body: JSON.stringify(uploadData), //需要用JSON.stringify把uploadData处理成JSON格式
    });
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
*/
