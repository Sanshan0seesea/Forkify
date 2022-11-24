import icons from 'url:../../img/icons.svg';
import View from './View';

//这个previewview做的事情就是只为一个元素mthis._data

class PreviewView extends View {
  _parentElement = '';

  _generateMarkup(result) {
    const id = window.location.hash.slice(1);
    //👆这行是什么意思

    //result.id === id ? 'preview__link--active' : ''}" href="#${result.id}">👇是为了运行那个mark的系统
    return `
    <li class="preview">
      <a class="preview__link ${
        this._data.id === id ? 'preview__link--active' : ''
      }" href="#${this._data.id}">
        <figure class="preview__fig">
          <img src="${this._data.image}" alt="${this._data.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this._data.title}</h4>
          <p class="preview__publisher">${this._data.publisher}</p>
          <div class="preview__user-generated ${
            this._data.key ? '' : 'hidden'
          }">
          <svg>
          <use href="${icons}#icon-user"></use>
          </svg>
          </div>
      </div>
      </a>
    </li> 
`;
  }
}

//没太理解为什么这里的link直接点进去就是页面了，是不是在之前做好了，现在只是把文字的html变成了图片呢——应该是

export default new PreviewView();
//这样就只能有一个ResultView
