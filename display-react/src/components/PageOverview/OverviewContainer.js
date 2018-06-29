import React, { Component } from 'react';
//import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import OverviewTable from './OverviewTable';
import { EnabledCard, AttentionCard } from './OverviewCards';
//import Overview

class OverviewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      nodesFetched: false,
    }
    this.updateTableData = this.updateTableData.bind(this);
  }

  deleteNode(uid) {

  }

  componentDidMount() {
    this.updateTableData();
    this.timerID = setInterval(this.updateTableData, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  updateTableData() {
    fetch('http://do-debian-sgp1-01.jaydncunningham.com:5000/nodes', {
      headers: {
        'Authorization': 'Bearer ' + this.props.userInfo.token,
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return [];
        }
      })
      .then((inpJson) => {
        //inpJson = inpJson.length === 0 ? [{}] : inpJson;
        this.setState({
          nodes: inpJson,
          nodesFetched: true,
        })
      });
  }

  render() {
    if (localStorage.getItem("token") === null) {
      return (<Redirect to='/login' />);
    }

    var enabledAmt = 0;
    var attentionAmt = 0;
    // TODO gotta be better way to do this
    this.state.nodes.forEach((row) => {
      if (row.node_status === 'ENABLED') {
        enabledAmt++;
      }
    });
    attentionAmt = this.state.nodes.length - enabledAmt;

    var cards = (this.state.nodesFetched && this.state.nodes.length !== 0)
      ?
      (
        <Row>
          <Col xs={12} md={3}>
            <EnabledCard amt={enabledAmt} />
          </Col>
          <Col xs={12} md={3}>
            <AttentionCard amt={attentionAmt} />
          </Col>
        </Row>
      ) : (null);

    var table = this.state.nodes.length !== 0 ?
      <OverviewTable deleteNode={this.deleteNode}
        updateTableData={this.updateTableData}
        nodes={this.state.nodes} /> :
      (this.state.nodesFetched ?
        <p>No nodes on your account.</p>
        : <p>Loading...</p>);

    return (
      <Container>
        {cards}
        <Row>
          <Col xs={12}>
            {table}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default OverviewContainer;