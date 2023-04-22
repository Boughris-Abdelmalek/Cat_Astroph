<script setup>
import Btn from './components/Btn.vue'
</script>

<template>
    <header>
        <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

        <div class="wrapper">
            <Btn />
        </div>
    </header>

    <main>
        <TheWelcome />
    </main>
</template>

<style scoped></style>
