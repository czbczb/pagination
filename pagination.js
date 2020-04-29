class Pagination {
    constructor(arg) {
        this.init(arg)
    }

    defaultConfig = {
        total: 40,
        totalPage: 0,
        pageSize: 10,
        rooId: 'pagination',
        currentPage: 1,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        paginationContainer: '',
        paginationClass: '',
    }

    _containerWrapper = null

    init({ config }) {
        this._containerWrapper = document.createElement('div');
        let pagination_left = document.createElement('div')
        let pagination_right = document.createElement('div')

        pagination_left.className = 'pagination_left'
        pagination_right.className = 'paginationInputWrapper'
        this._containerWrapper.className = this.paginationClass ? 'paginationWrapper ' + this.paginationClass : 'paginationWrapper';
        
        this._containerWrapper.appendChild(pagination_left);
        this._containerWrapper.appendChild(pagination_right);

        document.body.appendChild(this._containerWrapper)
        this.defaultConfig = Object.assign(this.defaultConfig, config)
        this.getTotalPage();
        this.changePage(this.defaultConfig.currentPage);
        this.createJumpInput()
        this._bindEvents()
    }

    _bindEvents = () => {
        this._containerWrapper.querySelector('.paginationInput').addEventListener('keydown', event => {
            console.log('enter')
            if (event.keyCode == 13 && event.target.value) {
                this.defaultConfig.currentPage = event.target.value
                this.changePage(event.target.value)
                event.target.value = ''
            }
        })

        this._containerWrapper.addEventListener('click',
            event => {
                if (event.target.className.indexOf('paginationEvent') != -1) {
                    let page = event.target.getAttribute('data-page');
                    this.changePage(page)
                }
            })

    }

    getTotalPage = () => {
        let pageTotal = this.defaultConfig.total / this.defaultConfig.pageSize;
        this.defaultConfig.totalPage = this.defaultConfig.total % this.defaultConfig.pageSize == 0
            ?
            parseInt(pageTotal)
            :
            parseInt(pageTotal) + 1
    }

    createPage = () => {

        let tempStr = `<span class="pageDescription">共 ${this.defaultConfig.total}条记录 共${this.defaultConfig.totalPage} 页 当前第 ${this.defaultConfig.currentPage}页</span>`;
        let prevPage = this.defaultConfig.currentPage - 1
        tempStr += `<span  dat-page="1" class="firstPage page ${this.defaultConfig.currentPage > 1 ? 'paginationEvent' : 'disabled'}">首页</span>`;
        tempStr += `<span  data-page="${prevPage}" class="prevPage page ${this.defaultConfig.currentPage > 1 ? 'paginationEvent' : 'disabled'}">上一页</span>`

        tempStr += this.getNumberPage()

        let nextPage = this.defaultConfig.currentPage + 1
        tempStr += `<span data-page="${nextPage}" class="nextPage page ${this.defaultConfig.currentPage < this.defaultConfig.totalPage ? 'paginationEvent' : 'disabled'}">下一页</span>`;
        tempStr += `<span data-page="${this.defaultConfig.totalPage}" class="endPage page ${this.defaultConfig.currentPage < this.defaultConfig.totalPage ? 'paginationEvent' : 'disabled'}">尾页</span>`;

        this.render(tempStr)
    }

    render = (renderHtmlStr) => {
        if (this.defaultConfig.paginationContainer) {
            document.getElementById(`#${this.defaultConfig.paginationContainer}`).querySelector('.pagination_left').innerHTML = renderHtmlStr
        }

        this._containerWrapper.querySelector('.pagination_left').innerHTML = renderHtmlStr
    }

    getNumberPage = () => {
        let startHtml = `<ul class="pageNumberWrapper">`
        let endHtml = `</ul>`
        let eleHtml = ''
        // 总页数小于5
        if (this.defaultConfig.totalPage < 5) {

            for (let i = 0; i < this.defaultConfig.totalPage; i++) {
                eleHtml += `<li 
            class="defaultPage paginationEvent ${this.defaultConfig.currentPage == (i + 1) ? 'currentPage' : ''}" 
            data-page="${i + 1}">${i + 1}</li>`

            }

        } else { // 总页数大于等于5
            if (this.defaultConfig.currentPage < 5) {
                // 当前页小于5
                for (let i = 0; i < 5; i++) {
                    eleHtml += `<li 
                        class="defaultPage paginationEvent ${this.defaultConfig.currentPage == (i + 1) ? 'currentPage' : ''}" 
                        data-page="${i + 1}">${i + 1}</li>`
                }
                eleHtml += `<li class="defaultPage">...</li>
                <li class="defaultPage paginationEvent 
                ${this.defaultConfig.currentPage == this.defaultConfig.totalPage ? 'currentPage' : ''}" 
                data-page="${this.defaultConfig.totalPage}">${this.defaultConfig.totalPage}</li>`

            } else if (this.defaultConfig.currentPage > this.defaultConfig.totalPage - 4) {
                // 当前页到了后四页
                eleHtml += `<li 
                        class="defaultPage paginationEvent ${this.defaultConfig.currentPage == 1 ? 'currentPage' : ''}" 
                        data-page="1">1</li>
                        <li class="defaultPage">...</li>`
                for (let i = this.defaultConfig.totalPage - 5; i < this.defaultConfig.totalPage; i++) {
                    eleHtml += `<li 
                        class="defaultPage paginationEvent ${this.defaultConfig.currentPage == (i + 1) ? 'currentPage' : ''}" 
                        data-page="${i + 1}">${i + 1}</li>`

                }
            } else if (this.defaultConfig.currentPage >= 5 && this.defaultConfig.currentPage <= this.defaultConfig.totalPage - 4) {
                // 当前页到了中间页
                eleHtml += `<li 
                        class="defaultPage paginationEvent ${this.defaultConfig.currentPage == 1 ? 'currentPage' : ''}" 
                        data-page="1">1</li>
                        <li class="defaultPage">...</li>`
                for (let i = this.defaultConfig.currentPage - 2; i < (parseInt(this.defaultConfig.currentPage) + 2); i++) {
                    console.log(this.defaultConfig.currentPage - 2, parseInt(this.defaultConfig.currentPage) + 2)
                    eleHtml += `<li 
                        class="defaultPage paginationEvent ${this.defaultConfig.currentPage == (i + 1) ? 'currentPage' : ''}" 
                        data-page="${i + 1}">${i + 1}</li>`

                }
                eleHtml += `<li class="defaultPage">...</li>
                <li class="defaultPage paginationEvent 
                ${this.defaultConfig.currentPage == this.defaultConfig.totalPage ? 'currentPage' : ''}" 
                data-page="${this.defaultConfig.totalPage}">${this.defaultConfig.totalPage}</li>`
            }
        }
        return startHtml + eleHtml + endHtml;
    }

    createJumpInput = () => {
        if (this.defaultConfig.showQuickJumper) {
            this._containerWrapper.querySelector(".paginationInputWrapper").innerHTML =  `跳转到<input class="paginationInput"/>页`
            return
        }
    }

    keyEnter = (currentPage) => {
        if (event.keyCode == 13) {
            this.changePage(currentPage)
        }
    }

    changePage = (currentPage) => {
        if (currentPage < 1 || currentPage > this.defaultConfig.totalPage) {
            return;
        }

        this.defaultConfig.currentPage = currentPage;
        this.createPage();
        alert(this.defaultConfig.currentPage)



    }

    // 每页显示条目点击筛选
    onShowSizeChange() {

    }
}