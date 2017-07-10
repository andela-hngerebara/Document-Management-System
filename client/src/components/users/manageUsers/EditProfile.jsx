import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { updateUserProfile, getOneUser } from './UsersActions';

/**
 * @desc Updates users Profile.
 * @class UsersProfile
 * @extends {Component}
 */
class EditProfile extends Component {
  /**
   * Creates an instance of UsersProfile.
   * @param {object} props
   * @memberof UsersProfile
   */
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.user.id,
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
      password: ''
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.getOneUser(this.props.params.creatorId);
  }

  /**
   *
   * @desc handles changes from the form.
   * @param {object} event
   * @memberof UsersProfile
   * @returns {void}
   */
  handleChange(event) {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  /**
   *
   * @desc handles submit of update form.
   * @param {object} event
   * @memberof UsersProfile
   * @returns {void}
   */
  handleUpdate(event) {
    event.preventDefault();
    this.props.updateUserProfile(this.state);
    browserHistory.push('/documents');
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <h3>My Profile</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col s12 editProfile-body">
            <div className="row">
              <div className="col m10  offset-m1 s12  ">
                <div className="card form z-depth-0">
                  <div className="card-content login-content">
                    <form>
                      <div className="row">
                        <div className="input-field col s12 m6">
                          <i className="material-icons prefix">account_box</i>
                          <input
                            id="first_name"
                            type="text"
                            name="firstName"
                            value={this.state.firstName}
                            onChange={this.handleChange}
                          />
                          <label htmlFor="first_name" className="active">
                            First Name
                          </label>
                        </div>
                        <div className="input-field col s12 m6">
                          <i className="material-icons prefix">account_box</i>
                          <input
                            id="last_name"
                            type="text"
                            name="lastName"
                            value={this.state.lastName}
                            onChange={this.handleChange}
                          />
                          <label htmlFor="last_name" className="active">
                            Last Name
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="input-field col s12">
                          <i className="material-icons prefix">email</i>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                          />
                          {this.state.showError &&
                            <div className="custom-error">
                              {this.state.errorMsg}
                            </div>}
                          <label htmlFor="email" className="active">
                            Email
                          </label>

                        </div>
                      </div>
                      <div className="row">
                        <div className="input-field col s12">
                          <i className="material-icons prefix">lock_outline</i>
                          <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Leave Blank if you don't want to edit"
                            value={this.state.password}
                            onChange={this.handleChange}
                          />
                          <label htmlFor="password" className="active">
                            Password
                          </label>
                        </div>
                      </div>
                      <div className="row">

                        <button
                          className="btn waves-effect waves-light col s6"
                          id="edit"
                          disabled={this.state.isLoading}
                          onClick={this.handleUpdate}
                        >
                          SAVE<i className="material-icons left">save</i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
EditProfile.propTypes = {
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.Auth.user
});

export default connect(mapStateToProps, {
  getOneUser,
  updateUserProfile
})(EditProfile);
