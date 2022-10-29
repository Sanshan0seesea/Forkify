import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      //👆选中点击点那个按钮
      if (!btn) return;
      //👆guard
      const goToPage = +btn.dataset.goto;
      //dataset就是指这个btn上的一些属性，+是把这个数值变成数字

      handler(goToPage);
      //👆运行传送进来的function
      //把goToPage再传到controller里面去
    });
  }

  //每一个向用户呈现内容的视图都需要一个generateMarkup
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    //page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto='${
        curPage + 1
      }' class="btn--inline pagination__btn--next">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
        <span>Page ${curPage + 1}</span>
      </button>`;
    }

    //last page
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-goto='${
        curPage - 1
      }' class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;
    }
    //other page
    if (curPage < numPages) {
      return `
      <button data-goto='${
        curPage - 1
      }' class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <button data-goto='${
        curPage + 1
      }' class="btn--inline pagination__btn--next">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
        <span>Page ${curPage + 1}</span>
      </button>`;
    }
    //page 1 and there are no other pages
    return '';
  }
}

export default new PaginationView();
