import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  DropdownItem,
  Table,
  Media,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import PageHeader from "../../components/PageHeader";

import api from "../../services/api";

export default function Admins() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  const allowedState = [
    { id: 1, name: "Alabama", email: 'Doctor' , level: 'Alto', creat_at: '08/11/2001' },
    { id: 2, name: "Georgia", email: 'Doctor' , level: 'Alto', creat_at: '08/11/2001' },
    { id: 3, name: "Tennessee", email: 'Doctor' , level: 'Alto', creat_at: '08/11/2001'}
  ];

  useEffect(() => {
    setUsers(allowedState)
    // api
    //   .get("admin/users", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((response) => {
    //     setUsers(response.data);
    //   });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const levelFormatter = (cell, row) => (
    <>
      <Badge className="badge-dot mr-4" color="">
        <i className="bg-warning" />
        <span className="status ">Alto</span>
      </Badge>        
    </>
  );
  

  const actionsFormatter = (cell, row) => (
    <>
      <Link
        className="btn btn-icon-only btn-success btn2"
        to={`admins/${row.id}`}
      >
        <span className="btn-inner--icon">
          <i class="fas fa-pen" />
        </span>
      </Link>
      <Button
        className="btn btn-icon-only btn-danger btn2"
        onClick={() => handleDeleteUser(row.id)}
      >
        <span className="btn-inner--icon">
          <i class="fas fa-trash" />
        </span>
      </Button>
    </>
  );

  async function handleDeleteUser(id) {
    try {
      await api.delete(`admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Erro ao deletar usuário, tente novamente: ", err);
    }
  }

  const pagination = paginationFactory({
    page: 1,
    alwaysShowAllBtns: false,
    showTotal: true,
    withFirstAndLast: true,
    firstPageTitle: "Primeira página",
    prePageTitle: "Voltar",
    nextPageTitle: "Avançar",
    lastPageTitle: "Última página",
    sizePerPageRenderer: ({
      options,
      currSizePerPage,
      onSizePerPageChange,
    }) => (
      <div className="dataTables_length" id="datatable-basic_length">
        <label>
          Mostrar{" "}
          {
            <select
              name="datatable-basic_length"
              aria-controls="datatable-basic"
              className="form-control form-control-sm"
              onChange={(e) => onSizePerPageChange(e.target.value)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          }{" "}
          registros.
        </label>
      </div>
    ),
    paginationTotalRenderer: (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        {" "}
        Mostrando {from} a {to} de {size} resultados
      </span>
    ),
  });

  const { SearchBar } = Search;

  return (
    <>
      <PageHeader name="Administradores" pathAdd="admins" />

      <Container className="mt--6" fluid>
        <Card className="card-frame">
          <CardBody>
            <ToolkitProvider
              data={users}
              keyField="name"
              columns={[
                {
                  dataField: "id",
                  text: "#",
                  sort: true,
                  style: { width: "5%" },
                },
                {
                  dataField: "name",
                  text: "Nome",
                  sort: true,
                },
                {
                  dataField: "email",
                  text: "Email",
                  sort: true,
                },
                {
                  dataField: "creat_at",
                  text: "Data",
                  sort: true,
                },
                {
                  dataField: "level",
                  text: "Nível de acesso",
                  formatter: levelFormatter,                  
                  sort: true,
                },
                {
                  dataField: "action",
                  isDummyField: true,
                  formatter: actionsFormatter,
                  text: "Ações",
                  sort: false,
                  style: { width: "5%" },
                },
              ]}
              search
            >
              {(props) => (
                <div className="py-4 table-responsive">
                  <div
                    id="datatable-basic_filter"
                    className="dataTables_filter px-4 pb-1"
                  >
                    <label>
                      Pesquisar:
                      <SearchBar
                        className="form-control-sm"
                        placeholder="Pesquisar"
                        {...props.searchProps}
                      />
                    </label>
                  </div>
                  <BootstrapTable
                    {...props.baseProps}
                    bootstrap4={true}
                    pagination={pagination}
                    bordered={false}
                  />
                </div>
              )}
            </ToolkitProvider>
          </CardBody>
        </Card>                
      </Container>
    </>
  );
}
