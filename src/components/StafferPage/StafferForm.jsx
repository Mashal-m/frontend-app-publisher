import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ActionButton from '../../components/ActionButton';
import AreasOfExpertise from './AreasOfExpertise';
import SocialLinks from './SocialLinks';
import ImageUpload from '../../components/ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RichEditor from '../../components/RichEditor';
import FieldLabel from '../FieldLabel';
import ButtonToolbar from '../ButtonToolbar';
import { basicValidate } from '../../utils/validation';


const extractOrgChoices = (stafferOptions) => {
  const { data = {} } = stafferOptions;

  if (!data.actions) {
    return [];
  }

  const { choices = [] } = data.actions.POST.position.children.organization;

  const defaultOption = [{ label: 'Select instructor organization', value: '' }];
  return defaultOption.concat(choices
    .map(choice => ({ label: choice.display_name, value: choice.value })));
};

const BaseStafferForm = ({
  handleSubmit,
  pristine,
  isSaving,
  isCreateForm,
  stafferOptions,
  sourceInfo: { referrer },
  cancelStafferInfo,
}) => {
  const formControlDisabled = pristine || isSaving;

  return (
    <div className="create-staffer-form">
      <form onSubmit={handleSubmit}>
        <Field
          name="profile_image.medium.url"
          component={ImageUpload}
          label={
            <FieldLabel
              id="image.label"
              text="Image"
              helpText={
                <div>
                  <p>Image Requirements:</p>
                  <ul>
                    <li>The image dimensions must be 110×110.</li>
                    <li>The image size must be less than 256KB.</li>
                  </ul>
                </div>
              }
              extraText="Image must be 110x110 pixels in size."
            />
          }
          id="profile_image"
          maxImageSizeKilo={256}
          requiredWidth={110}
          requiredHeight={110}
          className="staffer-image"
          required={isCreateForm}
        />
        <Field
          name="given_name"
          component={RenderInputTextField}
          type="text"
          label={<FieldLabel text="First name" />}
          required
        />
        <Field
          name="family_name"
          component={RenderInputTextField}
          type="text"
          label={<FieldLabel text="Last name" />}
          required
        />
        <Field
          name="position.title"
          component={RenderInputTextField}
          type="text"
          label={
            <FieldLabel
              id="title.label"
              text="Title"
              helpText={
                <div>
                  <p>Instructor&apos;s title at your organization.</p>
                  <p><b>Examples:</b></p>
                  <ul>
                    <li>Professor</li>
                    <li>Content Developer</li>
                    <li>Director</li>
                  </ul>
                </div>
              }
            />
          }
          required
        />
        <Field
          name="position.organization_id"
          component={RenderSelectField}
          options={extractOrgChoices(stafferOptions)}
          label={<FieldLabel text="Organization" />}
          required
        />
        <Field
          name="bio"
          component={RichEditor}
          label={<FieldLabel text="Biography" />}
          maxChars={250}
          validate={basicValidate}
          id="bio"
        />
        <Field
          name="major_works"
          component={RichEditor}
          label={<FieldLabel text="Major works" optional />}
          maxChars={250}
          id="works"
        />
        <FieldLabel text="Social links" className="mb-2" optional />
        <FieldArray
          name="urls_detailed"
          component={SocialLinks}
        />
        <FieldLabel text="Areas of expertise" className="mb-2" optional />
        <FieldArray
          name="areas_of_expertise"
          component={AreasOfExpertise}
        />
        <ButtonToolbar>
          <Link
            className="btn btn-outline-primary form-cancel-btn"
            to={referrer || '/'}
            disabled={formControlDisabled}
            onClick={cancelStafferInfo}
          >
            Cancel
          </Link>
          <ActionButton
            disabled={formControlDisabled}
            labels={isCreateForm ? {
              default: 'Create',
              pending: 'Creating',
            } : {
              default: 'Save',
              pending: 'Saving',
            }}
            state={isSaving ? 'pending' : 'default'}
          />
        </ButtonToolbar>
      </form>
    </div>
  );
};

BaseStafferForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  stafferOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  isSaving: PropTypes.bool,
  isCreateForm: PropTypes.bool,
  sourceInfo: PropTypes.shape({
    referrer: PropTypes.string,
  }).isRequired,
  cancelStafferInfo: PropTypes.func,
};

BaseStafferForm.defaultProps = {
  stafferOptions: {},
  isSaving: false,
  isCreateForm: false,
  cancelStafferInfo: () => {},
};

export default reduxForm({
  form: 'staffer-form',
})(BaseStafferForm);
export { basicValidate, extractOrgChoices, BaseStafferForm };
