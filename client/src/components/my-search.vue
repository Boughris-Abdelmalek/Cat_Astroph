<script>
import { onMounted, reactive, computed } from 'vue';
import axios from '../utils/axios';

export default {
    setup() {
        const state = reactive({
            searchTags: [],
            searchTerm: '',
            matchedCats: [],
            loading: true
        });

        const fetchTags = async () => {
            // Only fetch once if the data is already available
            if (state.searchTags.length) return;

            try {
                const response = await axios.get('/tags');
                const tags = await response.data;

                state.searchTags = tags;
                state.loading = false;
            } catch (error) {
                console.error(error);
                state.loading = true;
            }
        };

        const fetchMatchs = async (tag) => {
            try {
                const response = await axios.get(`/cats/match?string=${tag}`);
                const cats = await response.data;

                console.log(cats);

                state.matchedCats = cats;
            } catch (error) {
                console.error(error);
            }
        };

        onMounted(async () => {
            await fetchTags();
        });

        const matchedTags = computed(() => {
            const searchTerm = state.searchTerm.toLowerCase();
            return state.searchTags.filter((e) => e.toLowerCase().includes(searchTerm));
        });

        const selectTag = (currentTag) => {
            state.searchTerm = currentTag;
            fetchMatchs(state.searchTerm);
            state.searchTerm = "";
        };

        return { state, selectTag, matchedTags };
    }
};
</script>

<template>
    <section class="search-section">
        <h1 v-if="state.loading">Loading...</h1>
        <div v-else class="search-container">
            <h1>Cat Astroph</h1>
            <h3>Over 1114 pictures of cute cats</h3>
            <input
                :value="state.searchTerm"
                @input="(event) => (state.searchTerm = event.target.value)"
                @keyup.enter="selectTag(state.searchTerm)"
                placeholder="search"
                class="search-input"
            />
            <div v-if="state.searchTerm" class="search-suggestions">
                <ul>
                    <li v-for="tag in matchedTags" :key="tag" @click="selectTag(tag)" >
                        {{ tag }}
                    </li>
                </ul>
            </div>
        </div>
    </section>
    <section class="result-container">
        <h1>Results :</h1>
        <ul>
            <li v-for="cat in state.matchedCats.cats" :key="cat">
                {{ cat._id }}
                <img :src="`https://cataas.com/cat/${cat._id}`">
            </li>
        </ul>
    </section>
</template>
