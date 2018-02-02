import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContentPane from '../../Utils/ContentPane'
import ConstructInputs from '../../Utils/Forms'
import validateData from '../../Utils/validateData'
import IconItemList from '../IconItemList'
import { usersScheme } from '../../Utils/Forms/Schemes'
import Loading from '../../Utils/Loading'
import authtype from '../../Utils/authtype'

export default class Profiles extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true
        }
    }

    componentDidMount = async () => {
        const myUser = await this.props.glpi.getAnItem('User', this.props.currentUser.id)
        const myEmails = await this.props.glpi.getSubItems('User', this.props.currentUser.id, 'UserEmail')

        this.setState({
            isLoading: false,
            login: myUser.name,
            firstName: myUser.firstname,
            realName: myUser.realname,
            phone: myUser.phone,
            mobilePhone: myUser.mobile,
            phone2: myUser.phone2,
            administrativeNumber: myUser.registration_number,
            lastLogin: myUser.last_login,
            created: myUser.date_creation,
            modified: myUser.date_mod,
            currentEmails: myEmails.map(a => ({...a})),
            emails: validateData(myEmails, []),
            imageProfile: validateData(myUser.picture, "profile.png"),
            authentication: authtype(myUser.authtype),
            password: '',
            passwordConfirmation: '',
            category: {
                value: myUser.usercategories_id,
                request: {
                    params: ['UserCategory', null, null, {range: '0-200', forcedisplay: [2]}],
                    method: 'searchItems',
                    content: '1',
                    value: '2'
                }
            },
            defaultEntity:  {
                value: myUser.entities_id,
                request: {
                    params: [],
                    method: 'getMyEntities',
                    content: 'name',
                    value: 'id'
                }
            },
            comments: validateData(myUser.comment, ''),
            typeImageProfile: 'file',
            title: {
                value: myUser.usertitles_id,
                request: {
                    params: ['UserTitle', null, null, {range: '0-200', forcedisplay: [2]}],
                    method: 'searchItems',
                    content: '1',
                    value: '2'
                }
            },
            location: {
                value: myUser.locations_id,
                request: {
                    params: ['Location', null, null, {range: '0-200', forcedisplay: [2]}],
                    method: 'searchItems',
                    content: '1',
                    value: '2'
                }
            },
            defaultProfile: {
                value: myUser.profiles_id,
                request: {
                    params: [],
                    method: 'getMyProfiles',
                    content: 'name',
                    value: 'id'
                }
            },
            validSince: myUser.begin_date ? new Date(myUser.begin_date) : undefined,
            validUntil: myUser.end_date ? new Date(myUser.end_date) : undefined
        })
    }

    saveChanges = () => {

        let newUser = { 
            id: this.props.currentUser.id,
            firstname: this.state.firstName,
            realname: this.state.realName,
            password: this.state.password,
            password2: this.state.passwordConfirmation,
            phone: this.state.phone,
            mobile: this.state.mobilePhone,
            phone2: this.state.phone2,
            registration_number: this.state.administrativeNumber,
            picture: this.state.imageProfile,
            usercategories_id: this.state.category.value,
            entities_id: this.state.defaultEntity.value,
            comment: this.state.comments,
            usertitles_id: this.state.title.value,
            locations_id: this.state.location.value,
            profiles_id: this.state.defaultProfile.value,
            begin_date: this.state.validSince,
            end_date: this.state.validUntil
        }

        try {
            this.setState (
                { isLoading: true },
                async () => {
                    await this.props.glpi.updateItem('User', null, newUser)
                    console.log(this.props.glpi)
                    await this.props.glpi.updateEmails(newUser.id, this.state.currentEmails, this.state.emails)
                    this.props.showNotification('Success', 'saved profile')
                    this.setState ({isLoading: false})
                }
            )
        } catch (e) {
            this.setState ({isLoading: false})            
            this.props.showNotification('Error', e)
        }
    }

    changeState = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    changeEmail = (index, value) => {
        let emails = [...this.state.emails]
        emails[index].email = value
        this.setState({emails})
    }

    changeSelect = (name, value) => {
        this.setState({
            [name]: {
                ...this.state[name],
                value
            }
        })
    }

    deleteEmail = (index) => {
        this.setState({
            emails: this.state.emails.slice(0,index).concat(this.state.emails.slice(index+1))
        })
    }

    addEmail = () => {
        this.setState({
            emails: [
                ...this.state.emails,
                { email: '' }
            ]
        })
    }

    previewFile = (evt) => {

        const file = evt.target.files[0]
        if (file.type.match('image.*')) {
            let reader = new FileReader()

            reader.onload = ((theFile) => {
                return (e) => {
                this.setState({
                    imageProfile: e.target.result,
                    typeImageProfile: 'localFile'
                })
            }})(file)

            reader.readAsDataURL(file)
        }
   }

    openFileChooser = () => {
        this.inputElement.value = null
        this.inputElement.click()
    }

    render () {

        const user = this.state.isLoading ? '' : 
            usersScheme({
                state: this.state, 
                changeState: this.changeState,
                changeEmail: this.changeEmail,
                deleteEmail: this.deleteEmail,
                changeSelect: this.changeSelect,
                glpi: this.props.glpi
            })

        const inputAttributes = {
            type: 'file',
            accept: "image/*",
            name: "imageProfile",
            style: { display: 'none' },
            ref: (element) => {
                this.inputElement = element
            },
            onChange: this.previewFile
        }

        const renderComponent = this.state.isLoading ?  ( <Loading message="Loading..." /> ) :
        (
            <div className="list-content Profiles">

                <div className="listElement listElementIcon">
                    <span className="viewIcon"/>
                </div>
                

                <div className="listElement">

                    <div style={{ overflow: 'hidden' }}>
                        <input
                            {...inputAttributes}
                        />
                        <IconItemList 
                            image={this.state.imageProfile} 
                            type={this.state.typeImageProfile}
                            imgClick={this.openFileChooser}
                            size={150}
                            imgClass="clickable"/>
                    </div>

                </div>


                <ConstructInputs data={user.personalInformation} icon="contactIcon" />

                <ConstructInputs data={user.passwordInformation} icon="permissionsIcon" />
            
                <ConstructInputs data={user.validDatesInformation} icon="monthIcon" />

                <ConstructInputs data={user.emailsInformation} icon="emailIcon" />
                <div style={{ overflow: 'auto' }}>
                    <button className="win-button" style={{ float: 'right'}} onClick={this.addEmail}>Add email</button>
                </div>

                <ConstructInputs data={user.contactInformation} icon="phoneIcon" />
            
                <ConstructInputs data={user.moreInformation} icon="detailsIcon" />

                <ConstructInputs data={user.activityInformation} icon="documentIcon" />

                <button className="win-button win-button-primary" style={{ margin: "20px", float: "right" }} onClick={this.saveChanges}>
                    Save
                </button>
            
                <br/>

            </div>   
        )

        return (
            <ContentPane itemListPaneWidth={this.props.itemListPaneWidth}>

                { renderComponent }

            </ContentPane>

        )
    }
}

Profiles.propTypes = {
    itemListPaneWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    showNotification: PropTypes.func.isRequired,
    glpi: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}
