import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import { async } from 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }
//这只是来自parcel

//写npm start

//controller中是程序逻辑
//也就是开关与开关之间的逻辑，是最大的逻辑

//⚠️如果有时候发现写对了但网页不现实，请停止parcel，再来一次

//订阅者：code that wants to react
//发布者：code that knows when to react

//对于任何不是代码的静态资产（例如图片，音乐，视频），前面要加上url:

//..意味着回到父文件夹
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//因为是异步函数，所以即使使用了await也不会影响主线程
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    //这样就能取出当前点击的链接的ID，把它放到fetch里面去，让它开始loading

    // guard line
    if (!id) return;
    recipeView.renderSpinner();

    //0)update results view to mark selected search result

    resultView.update(model.getSearchResultsPage());

    //1) loading recipe

    await model.loadRecipe(id);

    //因为是异步函数，所以需要await

    //2)rendering recipe
    recipeView.render(model.state.recipe);
    //上面一行等于下面这行，是一样的，就是再次呈现
    //  const recipeView=new recipeView(model.state.recipe);

    //下面这行是为了方便更新不同人数，所以需要启动一下
    // controllerServings();
    //👆测试的时候才放这里，实际上需要它在每次点击的时候都运行一次
  } catch (err) {
    recipeView.renderError();
    //此处不需要传入任何数据，让renderError用自己的默认数值
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();

    //利用View这个模板，不需要在resultView中写新的function也可以得到漂亮的spinner（就只是继承了
    console.log(resultView);

    //1 得到检索结果
    const query = searchView.getQuery();
    if (!query) return;

    //2 加载检索结果
    await model.loadSearchResults(query);

    //3 展示结果
    // console.log(model.state.search.results);
    // resultView.render(model.state.search.results);

    resultView.render(model.getSearchResultsPage());

    //4 also render initial pagination btns

    paginationView.render(model.state.search);
    //把数据传到paginationView里面去
  } catch (err) {
    console.log(err);
  }
};

//下面这行体现的是如何把分页和换页码按钮联系起来，获得results
//⚠️上下两个很相似，做的事情也是交织的，需要多加理解

const controlPagination = function (goToPage) {
  //1 render new results

  resultView.render(model.getSearchResultsPage(goToPage));
  //传入新的参数gotopage后，下面的数据也会改变

  //⚠️因为view里面有clear，所以在任何新的HTML插入之前，之前的都会被clear

  //2 also render new pagination btns

  paginationView.render(model.state.search);
  //把数据传到paginationView里面去
};

//这个function只是做一些摁开关的事情，本身并不是程序，真正的功能在model里

//下面这个也可以被叫做handler，因为它就只是任务处理器，只不过是因为我们现在在MVC模板中所以它现在叫controller
const controllerServings = function (newServings) {
  //在运行完recipeView.addHandlerUpdateServings之后，recipeView.addHandlerUpdateServings的最后一行才写着运行这个handler的事情，传送了一些数据回来。

  //update the recipe servings (in state)
  model.updateServings(newServings);

  //第一个版本：update the recipe view(就再复制一遍就可以了，就只是再直接执行一遍render，把数据显示到前端)
  // recipeView.render(model.state.recipe);

  //第二个版本：每一次都重新render一遍太浪费内存了，所以最好是只update更新了的部分
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  model.addBookmark(model.state.recipe);
  //👆把数据的mark变过来
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  //👆把外观的mark变过来
};

//这个函数是订阅者，init是在程序一开始就已经开始运转了。在一开始就把controlrecipes传递到View那边。
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controllerServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandClick(controlPagination);
  // controllerServings();
  //👆不能放在这里，因为是异步函数，在这里启动这个function的话，API的数据都还没通过异步函数传过来，读取undefined的话肯定报错。要放到异步函数里面去。

  //这一部分是把数据传到function中
};

init();
