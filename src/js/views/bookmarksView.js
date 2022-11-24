//这个view和recipeView,resultview都差不多，直接复制黏贴过来的
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';
import View from './View';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'Ooops, no bookmarks yet 🤔 Try to get some?';
  _message = '';
  //上面这行和view有关

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    //在这里要返回一串数组，挨个循环，才能显示出来
    console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    //👆上面这一行是在尝试render每一个bookmark，但是并不直接呈现到DOM上，而是把return的mark up变成字符串。然后render这个function是在view里，传过去的false会触发mark up代码
  }
}

//没太理解为什么这里的link直接点进去就是页面了，是不是在之前做好了，现在只是把文字的html变成了图片呢——应该是

export default new BookmarksView();
//这样就只能有一个ResultView
