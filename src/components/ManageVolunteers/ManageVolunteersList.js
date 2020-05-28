import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { Link } from 'react-router-dom';

const moment = require('moment');

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontsize: 14,
    }
}))(TableCell)

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
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
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
});



class ManageVolunteersList extends Component {

    state = {
        role: '',
    }

    goToEditPage = (id) => {
        console.log('In goToEditPage', id)
        this.props.dispatch( { type: 'FETCH_SELECTED_VOLUNTEER', payload: id } );
    }

    disableVolunteer = (id) => {
        console.log('In disableVolunteer', id)
    }

    

    render() {
        const { classes } = this.props
        return (
            <>
                {this.props.state.volunteer.volunteer.map(volunteer => {
                    return <TableRow className={classes.row} key={volunteer.id}>
                        <CustomTableCell className="edit-link" onClick={() => this.goToEditPage(volunteer.id)} >
                            <Link to="/editVolunteer">
                                {volunteer.first_name} {volunteer.last_name}
                            </Link>
                        </CustomTableCell>
                        <CustomTableCell>
                            {moment(volunteer.birthday).fromNow(true)}
                        </CustomTableCell>
                        <CustomTableCell>

                        </CustomTableCell>
                        <CustomTableCell>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    
                                    onChange={this.handleChange}
                                >
                                    <MenuItem value={1}>Sidewalker</MenuItem>
                                    <MenuItem value={2}>Leader</MenuItem>
                                    <MenuItem value={3}>Barn Aid</MenuItem>
                                    <MenuItem value={4}>Feeder</MenuItem>
                                </Select>
                            </FormControl>
                        </CustomTableCell>
                        <CustomTableCell>
                            <Button variant="contained" onClick={() => this.disableVolunteer(volunteer.id)}>Disable</Button>
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

export default connect(mapStateToProps)(withStyles(styles)(ManageVolunteersList));