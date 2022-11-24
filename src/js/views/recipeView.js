import View from './View';

import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
//外部导入的不需要写路径 写个名字就可以了

class RecipeView extends View {
  //对于parcel和Babel来说，私有字段和方法无法继承，所以把他们都改成了_开头并且挪到View去了
  //改变完之后，添加了一个extends，把View里的拿过来了
  _parentElement = document.querySelector('.recipe');
  //把parent元素设置为recipe有利于后续操作渲染
  _errorMessage = 'Sryyyy, could not find your recipe! Plz try another one 🥺';
  _message = '';

  //👇这个函数是接收者，使用handler来接受controlRecipe()。这个函数相当于一个传送门。
  //搞这么多都是为了实现MVC框架
  //这函数用在这里是为了监听control中发生的事情
  addHandlerRender(handler) {
    // window.addEventListener('hashchange', controlRecipes);
    // window.addEventListener('load', controlRecipes);
    //但是为了避免重复的代码，可以使用forEach loop👇

    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      //👆这种写法是因为有时候可能没点到按钮而是点到了svg之类的，所以需要寻找最近的那个
      if (!btn) return;
      // console.log(btn);

      //👇btn.dataset.updateTo指的就是serving几位的那个➕号和➖号的按钮上的那个名叫data-update-to="${this._data.servings-1}"的tag，data-update-to会被转化成camel格式，所以这里才要这样写

      // const updateTo = +btn.dataset.updateTo;

      //👆+号还是为了把btn.dataset里面的数据弄成一个数字
      //但是还是可以简写，比如下面这样子
      const { updateTo } = btn.dataset;

      //👇把updateTo弄到传过来的函数handler里，传到controller里面
      if (+updateTo > 0) handler(+updateTo);
      //👆先用+把update变成数字，再如果这个数字大于0的时候，才传送数据到controller，否则不用变
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt=${
      this._data.title
    } class="recipe__img" />
      <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
    </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
              <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            .map(this._generateMarkupIngredients)
            .join('')}
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
  `;
  }
  _generateMarkupIngredients(ing) {
    return `
  <li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      ing.quantity
        ? new Fraction(
            ing.quantity
            //这里使用了npm里面的分数function，直接把数字变成function
          ).toString()
        : '❤️'
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
    </div>
  </li>
`;
  }
}

export default new RecipeView();
//不填入任何的数据
