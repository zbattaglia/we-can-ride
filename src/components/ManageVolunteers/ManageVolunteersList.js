import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import RoleDropdown from './RoleDropdown';

const moment = require('moment');

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontsize: 14,
        textAlign: 'center',
    }
}))(TableCell)

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    volunteerHover: {
        "&:hover": {
            color: "blue !important"
        }
    },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


class ManageVolunteersList extends Component {

    state = {
        name: [],
    };

    handleChange = event => {
        this.setState({ name: event.target.value });
    };

    componentDidMount () {
        this.props.dispatch ({ type: "GET_USER_ROLES"})
      }
      

    handleChangeMultiple = event => {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        this.setState({
            name: value,
        });
    };

    goToEditPage = (id) => {
        console.log('In goToEditPage', id)
        this.props.dispatch( { type: 'FETCH_SELECTED_VOLUNTEER', payload: id } );
    }

    disableVolunteer = (id) => {
        console.log('In disableVolunteer', id)
        this.props.dispatch( { type: 'DISABLE_VOLUNTEER', payload: id } );
    }

    activateVolunteer = (id) => {
        console.log('In activateVolunteer', id)
        this.props.dispatch( { type: 'ACTIVATE_VOLUNTEER', payload: id } );

    }

    render() {
        const { classes } = this.props
        return (
            <>
                    {JSON.stringify(this.props.history)}
                {this.props.state.volunteer.volunteer.map(volunteer => {
                    return <TableRow className={classes.row} key={volunteer.id}>
                        <CustomTableCell className="edit-link">
                            <Link onClick={() => this.props.history.push(`/editVolunteer/${volunteer.id}`)}>
                                {volunteer.first_name} {volunteer.last_name}
                            </Link>
                        </CustomTableCell>
                        <CustomTableCell>
                            {moment(volunteer.birthday).fromNow(true)}
                        </CustomTableCell>
                        <CustomTableCell>
                            {/* {JSON.stringify(this.props.state.volunteer)} */}
                            {volunteer.total_hours && volunteer.total_hours.hours}
                        </CustomTableCell>
                        <CustomTableCell>
                            <RoleDropdown user_id={volunteer.id}/>
                        </CustomTableCell>
                        <CustomTableCell>
                            {volunteer.disable?
                            <Button variant="contained" onClick={() => this.activateVolunteer(volunteer.id)}>Activate</Button>
                            :
                            <Button variant="contained" onClick={() => this.disableVolunteer(volunteer.id)}>Disable</Button>

                            }
                        </CustomTableCell>
                    </TableRow>
                })}
            </>
        )
    }
}


const mapStateToProps = state => ({
    state,
    classes: PropTypes.object.isRequired,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ManageVolunteersList));
