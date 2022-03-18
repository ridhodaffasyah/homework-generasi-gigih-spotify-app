import './App.css';

function App() {
  return (
    <><div id="app">
      <h1>Create Playlist</h1>
    </div><><div class="container">
      <form action="" id="form">
        <p class="title">Title</p>
        <input
          placeholder="Masukkan title"
          type="text"
          name="title"
          id="title"
          class="input"
          onfocus="{this.placeholder=''}"
          onblur="{this.placeholder='Masukkan title'}" />
        <p class="title">Description</p>
        <textarea
          placeholder="Tuliskan deskripsi"
          name="description"
          id="description"
          class="textarea"
          onfocus="{this.placeholder=''}"
          onblur="{this.placeholder='Tuliskan deskripsi'}"
        ></textarea>
        <input class="btn" type="submit" value="Create Playlist" />
      </form>
      <button class="btn" id="btn" onClick="getAPI()">Get API</button>
    </div><div class="container-items">
          <div class="container-song">
            <img
              class="song-pict"
              src="data:image/jpeg;base64,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"
              alt="TulusAlbum" />
            <div class="song-detail">
              <h2>Manusia Kuat</h2>
              <p>Tulus - Monokrom</p>
            </div>
            <input class="btn-add" type="submit" value="Add to playlist" />
          </div>
          <div class="container-song">
            <img
              class="song-pict"
              src="data:image/jpeg;base64,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"
              alt="TulusAlbum" />
            <div class="song-detail">
              <h2>Monokrom</h2>
              <p>Tulus - Monokrom</p>
            </div>
            <input class="btn-add" type="submit" value="Add to playlist" />
          </div>
        </div></></>
  );
}

export default App;
