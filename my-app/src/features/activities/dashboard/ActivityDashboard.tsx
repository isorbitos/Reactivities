import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityStore  from '../../../app/stores/activityStore';
import ActivityList from './ActivityList';


const ActivityDashboard: React.FC = () => {

    //TODO that red warning form there
    const activityStore = useContext(ActivityStore)
    useEffect(() => {
      activityStore.loadActivities();
    }, [activityStore]);
    if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />
    
    return (
        <div>
            <Grid>
                <Grid.Column width={10}>
                    <ActivityList/>
                </Grid.Column>
                <Grid.Column width={6}>
                    <h1>Activity filters</h1>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default observer(ActivityDashboard);