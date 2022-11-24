import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

//state就只是一个大仓库

const createRecipeObject = function (data) {
  //就是把data编程object的那个函数单独拿出来写了个
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    //为了让新上传的菜谱中保存key,使用了&&短路法，如果recipe.key不存在，这行就不存在，如果存在，{key:recipe.key}就会被展开，也就是变成key:recipe.key。这样就可以有条件地为object添加attributes。
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    //把API URL换成变量了而已，其实这里就是个从link API得到数据的过程

    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      //👆意思就是在state的bookmark里面存不存在id等于当前id的（id是这个函数的接收，在前面可以看到，如果查到当前ID是被bookmark的话，就把bookmarked那个标记打开👇
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    console.error(`${err}💣`);
    throw err;
    //从model里把错误丢到controler去，这样controller才可以显示
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    //这个是什么意思？👆加上了?key=${KEY}这一行的话，搜索出来的内容就也会包含那些我们后来添加的部分
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    //👆要重新设置，否则page会一直停留在上一次留在的页数上
  } catch (err) {
    console.log(`${err}💣`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  //把user停留在哪一页的信息保存下来是很有必要的
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  //如果我们需要page1的话，那么start是0，结尾是10——为了方便用slice分割得到的结果
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQuantity=(OldQuantity*newServings)/state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  //👆用JSON.stringify来把state.bookmarks转化为一个string
};

export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);

  //mark current recipe as a bookmark

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

//在编程中，当我们需要添加一些东西的时候，我们会需要得到一整个recipe，而当删除的时候，只需要id作为输入

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  //findIndex方法，当后面的是true的时候，会返回那个元素的index
  state.bookmarks.splice(index, 1);

  //mark current recipe as not a bookmark

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
  //上面是在把字符串还原成JSON文件
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
//👆还是写一个，但不一定非要运行，就是先写一个

//👇这个函数最终会向API发出申请，所以
export const uploadRecipe = async function (newRecipe) {
  try {
    //1) get original input and tranfrom its format to fit into API
    //使用map因为map很适合基于一些现有数据创造新数组
    const ingredients = Object.entries(newRecipe)
      .filter(
        //Object.entries(newRecipe)就是把newRecipe再编成object
        entry => entry[0].startsWith('ingredient') && entry[1] !== ''
      )
      // .map(ing => {
      //   const ingArr = ing[1]
      //     .replaceAll(' ', '') //需要把空的数值删掉
      //     .split(',');
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        const [quantity, unit, description] = ingArr;
        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format! Plz use a correct one');

        return { quantity: quantity ? +quantity : null, unit, description };
        //ing[1]指的是之前那个arr，每个arr的第二个，也就是真正的数据
        //“ quantity ? +quantity : null ”这个表达式是为了应对有时候quantity不存在的情况
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
  //👆我们只需要那些第一个元素是ingredient并且第二个元素不是空的arr，因为这个是菜单
};
