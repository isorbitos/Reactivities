import React, {  useContext, useEffect, useState } from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import { v4 as uuidv4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Field, Form as FinalForm } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
    title: isRequired({ message: 'The title is required' }),
    category: isRequired('Category'),
    description: composeValidators(isRequired('Description'), hasLengthGreaterThan(4)({ message: 'Description needs to be at least 5 chars' }))(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {

    const rootStore = useContext(RootStoreContext)
    const { createActivity, editActivity, submitting,  loadActivity } =rootStore.activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id).then((activity) => setActivity(new ActivityFormValues(activity))).finally(() => setLoading(false));
        }

    }, [loadActivity, match.params.id]);


    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuidv4()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }



    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing >
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => (
                            <Form onSubmit={handleSubmit} loading={loading}>
                                <Field name='title' placeholder='Title' value={activity.title} component={TextInput} />
                                <Field name='description' rows={3} placeholder='Description' value={activity.description} component={TextAreaInput} />
                                <Field name='category' placeholder='Category' options={category} value={activity.category} component={SelectInput} />
                                <Form.Group widths='equal'>
                                    <Field name='date' placeholder='Date' date={true} value={activity.date} component={DateInput} />
                                    <Field name='time' placeholder='Time' time={true} value={activity.time} component={DateInput} />
                                </Form.Group>

                                <Field name='city' placeholder='City' value={activity.city} component={TextInput} />
                                <Field name='venue' placeholder='Venue' value={activity.venue} component={TextInput} />
                                <Button loading={submitting} disabled={loading || invalid || pristine} floated="right" positive type="submit" content="Submit" />
                                <Button onClick={() => activity.id ? history.push(`/activities/${activity.id}`) : history.push('/activities')}
                                    disabled={loading} floated="right" type="button" content="Cancel" />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>

    )
}

export default observer(ActivityForm);