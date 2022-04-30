import MeetupList from '../components/meetups/MeetupList';
import {MongoClient} from 'mongodb';

function HomePage (props) {
   
    return(
            <MeetupList meetups={props.meetups}/>
    );
}


export async function getStaticProps(){
    //you can fetch data from an API
        const client = await MongoClient.connect('mongodb+srv://skander-borchani:skander-borchani@lets-meet.mpoze.mongodb.net/lets-meet?retryWrites=true&w=majority');
        const db = client.db();
        
        const meetupsCollection = db.collection('meetups');

        const meetups = await meetupsCollection.find().toArray();

        client.close();
    //Always return a object
    return {
        props:{
            meetups:meetups.map(meetup => ({
                title : meetup.title ,
                address : meetup.address,
                image: meetup.image,
                id: meetup._id.toString()

            })),
        },
        revalidate:1,
    }
}
export default HomePage;