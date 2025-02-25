import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import About from 'components/About';
import Dictionary from 'components/Dictionary';
const Grammar = lazy(() => import(/* webpackChunkName: "grammarComponent" */'components/Grammar'));

import './index.scss';
import { dictionaryUrl } from 'consts';
import { fetchDictionary, setPageAction } from 'actions';
import { getPageFromPath, getPathFromPage } from 'routing';

interface IRouterProps {
    isLoading: boolean;
    page: string;
    setPage: (page: string) => void;
}

interface IRouterState {
    prevPage: string;
}

class Router extends React.Component<IRouterProps, IRouterState> {
    constructor(props) {
        super(props);
        this.onChangeUrl = this.onChangeUrl.bind(this);
        window.onpopstate = this.onChangeUrl;
        this.state = {
            prevPage: props.page,
        };
    }
    public render() {
        const { page } = this.props;
        const { prevPage } = this.state;
        const addClass = page !== prevPage ? 'hide' : 'show';
        return (
            <div
                className={`animationContainer ${addClass} ${prevPage}Route`}
                onAnimationEnd={() => {
                    if (page !== prevPage) {
                        this.setState({prevPage: page});
                    }
                }}
            >
                {this.renderContent(prevPage)}
            </div>
        );
    }
    public renderContent(page) {
        switch (page) {
            case 'grammar':
                return (
                    <Suspense fallback={<div>&nbsp;</div>}>
                        <Grammar/>
                    </Suspense>
                );
            case 'dictionary':
                return (
                    <Dictionary/>
                );
            case 'about':
                return (
                    <About/>
                );

        }
    }
    private onChangeUrl() {
        const page = getPageFromPath();
        if (getPathFromPage(this.props.page) !== page) {
            this.props.setPage(page);
        }
    }
}

function mapStateToProps({ isLoading, page }) {
    return { isLoading, page };
}

function mapDispatchToProps(dispatch) {
    return {
        setPage: (page) => dispatch(setPageAction(page)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
