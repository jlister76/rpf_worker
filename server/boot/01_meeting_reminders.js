'use strict';

const moment = require('moment');
const  _ = require('lodash');
const loopback = require('loopback');
const path = require('path');

module.exports = (app)=>{
  /*
   * The `app` object provides access to a letiety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  let meeting = app.models.meeting;
  let twentyFourHours = moment().add(1,'day');

  try {
    meeting.find({where: {and:[
      {meeting_datetime:{gte:moment()}},
      {meeting_datetime:{lte:twentyFourHours}}
    ],
      schedule_status: 'confirmed'
    }})
      .then(function(meetings){

        _.forEach(meetings, function(meeting){

          console.log(data);
          console.log(meeting.email, moment(meeting.meeting_datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"));
          //send email
          let messageVars = {
            id: meeting.id,
            dps: meeting.fname + ' ' + meeting.lname,
            meeting_date: moment(meeting.meeting_datetime).format('dddd, MMMM Do YYYY h:mm a'),
            team_leader: meeting.team_leader,
            location_name: meeting.location_name,
            location: meeting.location,
            cross_street: meeting.cross_street,
            town: meeting.town,
            heath_report: meeting.heath_report,
            facility: meeting.facility,
            locate_technician: meeting.locate_technician
          };
          // prepare a loopback template renderer
          let renderer = loopback.template(path.resolve(__dirname, '../../server/views/email-template.ejs'));
          let html_body = renderer(messageVars);

          app.models.Email.send({
            to: [meeting.team_leader_email, meeting.email],
            from: 'locateATMOS@heathus.com',
            subject: 'Replication Meeting Reminder',
            html: html_body
          }, function(err, mail) {
            if (err) {
              console.error(err)
            }
            console.log('email sent!');
          })
        })

      })
      .catch(function(err){if(err){console.error(err)}})
  } catch(err){
    cnosole.error(err);
  }




};
