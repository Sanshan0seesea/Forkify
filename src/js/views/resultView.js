//这个view和recipeView差不多
import icons from 'url:../../img/icons.svg';
import View from './View';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Try again plz 🥺';
  _message = '';
  //上面这行和view有关
  _generateMarkup() {
    //在这里要返回一串数组，挨个循环，才能显示出来
    console.log(this._data);
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);
    //👆这行是什么意思

    //result.id === id ? 'preview__link--active' : ''}" href="#${result.id}">👇是为了运行那个mark的系统
    return `
    <li class="preview">
      <a class="preview__link ${
        result.id === id ? 'preview__link--active' : ''
      }" href="#${result.id}">
        <figure class="preview__fig">
          <img src="${result.image}" alt="${result.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${result.title}</h4>
          <p class="preview__publisher">${result.publisher}</p>
        </div>
      </a>
    </li> 
`;
  }
}

//没太理解为什么这里的link直接点进去就是页面了，是不是在之前做好了，现在只是把文字的html变成了图片呢——应该是

export default new ResultView();
//这样就只能有一个ResultView
