//这个view和recipeView差不多 区别是它们有不同的errorMessage之类的
import icons from 'url:../../img/icons.svg';
import View from './View';
import previewView from './previewView';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Try again plz 🥺';
  _message = '';

  _generateMarkup() {
    //在这里要返回一串数组，挨个循环，才能显示出来
    console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
    //👆上面这一行是在尝试render每一个bookmark，但是并不直接呈现到DOM上，而是把return的mark up变成字符串。然后render这个function是在view里，传过去的false会触发mark up代码
  }
}

//没太理解为什么这里的link直接点进去就是页面了，是不是在之前做好了，现在只是把文字的html变成了图片呢——应该是

export default new ResultView();
//这样就只能有一个ResultView
