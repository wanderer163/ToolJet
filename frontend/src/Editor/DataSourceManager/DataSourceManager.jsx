import React from 'react';
import { datasourceService, authenticationService } from '@/_services';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataSourceTypes } from './DataSourceTypes';
import { Elasticsearch } from './Elasticsearch';
import { Redis } from './Redis';
import { Postgresql } from './Postgresql';
import { Mysql } from './Mysql';

const defaultOptions = { 
    'postgresql': {
        host: 'localhost',
        port: 5000,
        username: '',
        password: ''
    },
    'mysql': {
        host: 'localhost',
        port: 5000,
        username: '',
        password: ''
    },
    'redis': {
        host: 'localhost',
        port: 5000,
        username: '',
        password: ''
    },
    'elasticsearch': {
        host: 'localhost',
        port: 5000,
        username: '',
        password: ''
    }
}

class DataSourceManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            showModal: false,
            appId: props.appId,
            options: { 
               
            }
        };
    }

    componentDidMount() {
        console.log('props',this.props);
        this.state = {
            appId: this.props.appId
        }
    }

    selectDataSource = (source) => { 
        this.setState({ 
            selectedDataSource: source,
            options: defaultOptions[source.kind],
            name: source.kind
        });
    }

    onNameChanged = (newName) => {
        this.setState({
            name: newName
        })
    }

    optionchanged = (option, value) => {
        this.setState( { options: { ...this.state.options, [option]: value } } );
    }

    hideModal = () => {
        this.setState({ 
            showModal: false,
            selectedDataSource: null
        });
    }

    createDataSource = () => {
        let _self = this;

        const  { appId, options, selectedDataSource, name } = this.state;
        const kind = selectedDataSource.kind;

        datasourceService.create(appId, name, kind, options).then((data) => {
            this.setState( { showModal: false } );
            toast.success('Datasource Added', { hideProgressBar: true, position: "top-center", });
            this.props.dataSourcesChanged();
        });
    }
   
    render() {
        const { showModal, selectedDataSource, options } = this.state;

        return (
            <div>

                <ToastContainer/>
                
                {!showModal && <button className="btn btn-light" onClick={() => this.setState({ showModal: true })}>+</button>}

                <Modal
                    show={this.state.showModal}
                    size="xl"
                    className="mt-5"
                    // onHide={handleClose}
                    backdrop="static"
                    keyboard={false}>

                        <Modal.Header>
                            <Modal.Title>
                             {selectedDataSource &&
                             <div className="row">
                                <img src={selectedDataSource.icon} height="25" width="25" className="mt-2 col-md-2"></img>
                                <input 
                                    type="text" 
                                    onChange={(e) => this.onNameChanged(e.target.value)}
                                    class="form-control-plaintext form-control-plaintext-sm col" 
                                    value={this.state.name}
                                    autoFocus
                                />
                             </div>
                               
                             }
                            </Modal.Title>
                            <Button variant="light" onClick={() => this.hideModal()}>
                                Close
                            </Button>
                        </Modal.Header>

                        <Modal.Body>

                        {!selectedDataSource &&
                            <div class="row row-deck">

                                {DataSourceTypes.map((dataSource) => (<div class="col-md-2">
                                    <div class="card" role="button" onClick={() => this.selectDataSource(dataSource)}>
                                            <div class="card-body">
                                                <center>
                                                    <img src={dataSource.icon} width="50" height="50" alt=""/>
                                                    <br></br>
                                                    <br></br>
                                                    {dataSource.name}
                                                </center>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            
                            </div>
                        }

                        {selectedDataSource &&
                            <div>
                                {selectedDataSource.kind === 'elasticsearch' && 
                                    <Elasticsearch
                                        optionchanged={this.optionchanged}
                                        createDataSource={this.createDataSource}
                                        options={options}
                                        hideModal={this.hideModal}
                                    />
                                }
                                {selectedDataSource.kind === 'redis' && 
                                    <Redis
                                        optionchanged={this.optionchanged}
                                        createDataSource={this.createDataSource}
                                        options={options}
                                        hideModal={this.hideModal}
                                    />
                                }
                                {selectedDataSource.kind === 'postgresql' && 
                                    <Postgresql
                                        optionchanged={this.optionchanged}
                                        createDataSource={this.createDataSource}
                                        options={options}
                                        hideModal={this.hideModal}
                                    />
                                }

                                {selectedDataSource.kind === 'mysql' && 
                                    <Mysql
                                        optionchanged={this.optionchanged}
                                        createDataSource={this.createDataSource}
                                        options={options}
                                        hideModal={this.hideModal}
                                    />
                                }
                                
                            </div>
                        }

                        </Modal.Body>

                        <Modal.Footer>
                        
                        </Modal.Footer>
                </Modal>
            </div>
            
        )
    }
}

export { DataSourceManager };