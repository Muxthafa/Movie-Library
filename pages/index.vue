<template>
  <div class="home">

    <!--- hero -->
    <Hero />

    <!--search-->
    <div class="container search">
      <input @keyup.enter="onSearch" type="text" placeholder="Search" v-model="searchInput">
      <button @click="clearSearch" v-show="searchInput !== ''" class="button">Clear Search</button>
    </div>

    <Loading v-if="pendingState" />
    
    <!-- movies -->
    <div v-if="!pending" class="container movies">
      <div id="movie-grid" v-if="searchInput === '' && !pendingState" class="movies-grid" >
        <div class="movie" v-for="(movie,index) in movies.results" :key="index">
          <div class="movie-img">
            <img :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" alt="">
            <p class="review">{{ movie.vote_average  }}</p>
            <p class="overview">{{ movie.overview }}</p>
          </div>
          <div class="info">
            <p class="title">{{ movie.title.slice(0,25) }}<span v-if="movie.title.length > 25">...</span></p>
            <p class="release">
              Released:
              {{
                new Date(movie.release_date).toLocaleString('en-us', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              }}
            </p>
            <NuxtLink class="button button-light" :to="{name: 'movies-movieId', params: { movieId: movie.id}}">Get more Info</NuxtLink>
          </div>
        </div>
      </div>
      <div id="movie-grid" v-if="searchInput !== '' && !pendingState"  class="movies-grid" >
        <div class="movie" v-for="(movie,index) in searchedMovies" :key="index">
          <div class="movie-img">
            <img :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" alt="sdd">
            <p class="review">{{ movie.vote_average  }}</p>
            <p class="overview">{{ movie.overview }}</p>
          </div>
          <div class="info">
            <p class="title">{{ movie.title.slice(0,25) }}<span v-if="movie.title.length > 25">...</span></p>
            <p class="release">
              Released:
              {{
                new Date(movie.release_date).toLocaleString('en-us', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              }}
            </p>
            <NuxtLink class="button button-light" :to="{name: 'movies-movieId', params: { movieId: movie.id}}">Get more Info</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const runtimeConfig = useRuntimeConfig()
  useHead({
    title: 'Movies Info - App',
    meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'Get all the latest streaming movies in theaters & online',
          },
          {
            hid: 'keywords',
            name: 'keywords',
            content: 'movies, stream, stremaing',
          },
        ]
  });
  
  const searchInput = ref('')
  const searchedMovies = ref([])
  const pendingState = ref(null)
  const {data: movies, pending} = await useFetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${runtimeConfig.apiSecret}&language=en-US&page=1`)

  function clearSearch(){
    searchInput.value =''
    searchedMovies.value =[]
  }

  async function onSearch() {
    const {data: movies, pending} = await useFetch(`https://api.themoviedb.org/3/search/movie?api_key=${runtimeConfig.apiSecret}&language=en-US&page=1&query=${searchInput.value}`)
    searchedMovies.value = toRaw(movies.value).results
    pendingState.value = true
  }

  const moviesLength = computed(() => searchedMovies.value.length)

  watch([pendingState, moviesLength], () =>{
    if(pendingState.value && (moviesLength.value > 0 || searchInput.value === '')){
      setTimeout(()=>{
        pendingState.value = false
      }, 1500)
    }
  })

  watch(searchInput, async () =>{
    pendingState.value = true
    await new Promise((res) => setTimeout(res, 1000))
    onSearch()
  })

</script>
<style lang="scss">
  .search {
    display: flex;
    justify-content: center;
    padding: 32px 16px;
    input {
      max-width: 350px;
      width: 100%;
      padding: 12px 6px;
      font-size: 14px;
      border: none;
      &:focus {
        outline: none;
      }
    }
    .button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .movies {
    padding: 32px 16px;
    .movies-grid {
      display: grid;
      column-gap: 32px;
      row-gap: 64px;
      grid-template-columns: 1fr;
      @media (min-width: 500px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (min-width: 750px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (min-width: 1100px) {
        grid-template-columns: repeat(4, 1fr);
      }
      .movie {
        position: relative;
        display: flex;
        flex-direction: column;
        .movie-img {
          position: relative;
          overflow: hidden;
          &:hover {
            .overview {
              transform: translateY(0);
            }
          }
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
          .review {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            background-color: #6507fc;
            color: #fff;
            border-radius: 0 0 16px 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .overview {
            line-height: 1.5;
            position: absolute;
            bottom: 0;
            background-color: rgba(101, 7, 252, 0.7);
            padding: 12px;
            color: #fff;
            transform: translateY(100%);
            transition: 0.5s ease-in-out all;
          }
        }
        .info {
          margin-top: auto;
          .title {
            margin-top: 8px;
            color: #fff;
            font-size: 20px;
          }
          .release {
            margin-top: 8px;
            color: #c9c9c9;
          }
          .button {
            margin-top: 8px;
          }
        }
      }
    }
  }
</style>