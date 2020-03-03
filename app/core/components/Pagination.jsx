import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from "react-immutable-proptypes";
import './Pagination.scss';

const propTypes = {
    items: ImmutablePropTypes.list.isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number,
    pageSize: PropTypes.number
};

const defaultProps = {
    initialPage: 1,
    pageSize: 10
};

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pager: {}};
    }

    componentDidMount() {
        if (this.props.items && this.props.items.size) {
            this.setPage(this.props.initialPage);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.items !== prevProps.items) {
            this.setPage(this.props.initialPage);
        }
    }

    componentWillUnmount() {
        this.setState({pager: {}});
    }

    setPage(page) {
        let {items, pageSize} = this.props;
        let pager = this.state.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        // get new pager object for specified page
        pager = this.getPager(items.size, page, pageSize);

        // get new page of items from items array
        let pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

        // update state
        this.setState({pager: pager});

        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }

    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    render() {
        let pager = this.state.pager;

        if (!pager.pages || pager.pages.length <= 1) {
            return null;
        }
        const summary = `Showing ${pager.currentPage} - ${pager.totalPages} of ${pager.totalItems} results`;
        return (
            <React.Fragment>
                <div className="govuk-grid-row govuk-!-margin-bottom-2">
                    <div className="govuk-grid-column-full">
                        <div className="pagination__summary govuk-!-font-size-19">{summary}</div>
                    </div>
                </div>
                <div className="govuk-grid-row pagination-center">
                    <div className="govuk-grid-column-full">
                        <nav role="navigation" aria-label="comments-pagination">
                            <ul className="pagination govuk-!-font-size-19">
                                <li className="pagination__item">
                                    <a className="pagination__link" onClick={() => this.setPage(pager.currentPage - 1)}><span aria-hidden="true"
                                                                                                                              role="presentation">&laquo;</span> Previous</a>
                                </li>
                                {pager.pages.map((page, index) => {
                                        const current = pager.currentPage === page ? 'current' : '';
                                        const paginationLink = `pagination__link ${current}`;
                                        return <li key={index} className="pagination__item">
                                            <a className={paginationLink}
                                               onClick={() => this.setPage(page)}>{page}</a>
                                        </li>

                                    }
                                )}
                                <li className="pagination__item">
                                    <a className="pagination__link" onClick={() => this.setPage(pager.currentPage + 1)}>Next <span
                                        aria-hidden="true" role="presentation">&raquo;</span> </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </React.Fragment>

        );
    }
}



Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default Pagination;
