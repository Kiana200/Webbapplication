import { ActivityArgs } from '@/constants/interfaces';

const activityParser = (payload: ActivityArgs) => {
    const {
        uuid,
        title,
        group_id,
        start,
        end,
        allDay,
        duration,
        freq,
        dtstart,
        until,
        interval
      } = payload;

      let parsed_event;
        if(freq === 'never') {
          parsed_event = {
            id: uuid,
            groupId: group_id,
            allDay: allDay, 
            start: start,
            end: end,
            title: title,
            duration: duration,
          };
        }
        else { // Handle an event that will be repeated.
          parsed_event = {
            id: uuid,
            groupId: group_id,
            allDay: allDay, 
            start: start,
            end: end,
            title: title,
            duration: duration,
            rrule : {
              interval: interval,
              freq: freq,
              dtstart: dtstart,
              until: until,
            }
          };
        }
        return parsed_event;
};

export default activityParser;