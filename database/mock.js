/**
 * Define and export the dummy data.
 */
 export const sampleObject1 = {
    id: '001',
    title: 'this is a title',
    desc: 'Do elit pariatur aliqua laborum dolore qui.',
  };
  export const sampleObject2 = {
    firstName: 'John',
    lastName: 'Doe',
  };
  
  export const Playlists = [{
    id: '001',
    name: 'Anh 1',
    songs: 20,
    thumbnail: require('Assets/images/thumb_1.png')
  },
  {
    id: '002',
    name: 'Anh 2',
    songs: 5,
    thumbnail: require('Assets/images/thumb_2.png')
  },
  {
    id: '003',
    name: 'Anh 3',
    songs: 5,
    thumbnail: require('Assets/images/thumb_2.png')
  }]
  
  export const Favorite = [{
    id: '001',
    url: '',
    title: 'Ai Mới Là Kẻ Xấu Xa',
    album: '99%',
    artist: 'RPT MCK',
    thumbnail: require('Assets/audio/13.png'),  
    audio_filepath:''
  },{
    id: '002',
    url: '',
    title: 'Đánh mất anh là lỗi của em',
    album: 'AYE',
    artist: 'Duy Tân',
    thumbnail: require('Assets/images/thumb_3.png'),
    audio_filepath:''
  },{
    id: '003',
    url: '',
    title: 'Đánh mất anh là lỗi của em',
    album: 'AYE',
    artist: 'Duy Tân',
    thumbnail: require('Assets/images/thumb_3.png'),
    audio_filepath:''
  },{
    id: '004',
    url: '',
    title: 'Đánh mất anh là lỗi của em',
    album: 'AYE',
    artist: 'Duy Tân',
    thumbnail: require('Assets/images/thumb_3.png'),
    audio_filepath:''
  }]
  
  const dummyData = { sampleObject1, sampleObject2, Playlists, Favorite };
  
  export default dummyData;
  