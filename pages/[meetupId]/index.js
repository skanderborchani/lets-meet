import MeetupDetail from "../../components/meetups/MeetupDetail";
import {MongoClient , ObjectId} from 'mongodb';

function MeetupDetails(props) {
    return (
          <MeetupDetail 
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address} 
                description={props.meetupData.description}
          />
            
    );
}
//when we use getstaticprops with a dynamic page we have to use a function called getStaticPaths
export async function getStaticPaths(){
      
      const client = await MongoClient.connect('mongodb+srv://skander-borchani:skander-borchani@lets-meet.mpoze.mongodb.net/lets-meet?retryWrites=true&w=majority');
      const db = client.db();
      
      const meetupsCollection = db.collection('meetups');

      const meetups = await meetupsCollection.find({}, {_id:1}).toArray();
       client.close();
      //find({},{_id:1}) lets us fetch only the ids of the meetups
      return{
            fallback: false,
            paths:meetups.map(meetup =>({params: {meetupId:meetup._id.toString() },
       }) ),
          
      };
}

export async function getStaticProps(context){
      const meetupId = context.params.meetupId;
      //fetch data for a single meetup
      //context.params.meetupid lets get the meetup id from the url 
      const client = await MongoClient.connect('mongodb+srv://skander-borchani:skander-borchani@lets-meet.mpoze.mongodb.net/lets-meet?retryWrites=true&w=majority');
      const db = client.db();
      
      const meetupsCollection = db.collection('meetups');
      const selectedMeetup = meetupsCollection.findOne({
            _id : ObjectId(meetupId),
      });
      console.log(selectedMeetup);
      return {
           
            props:{
                  meetupData: {
                        id:(await selectedMeetup)._id.toString(),
                        title:(await selectedMeetup).title,
                        image:(await selectedMeetup).image,
                        address:(await selectedMeetup).address,
                        description:(await selectedMeetup).description,

                  },
             
            },
      };
}
export default MeetupDetails;