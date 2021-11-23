<script context="module">
	export const prerender = true;
</script>

<script>
	import '../app.css';
	import Menu from '../components/Menu.svelte';
	import Header from '../components/Header.svelte';
	import Editor from '../components/Editor.svelte';

	let sidebar = false;
</script>

<div class="content">
	<Menu bind:closeSidebar={sidebar}/>
	<section class="main">
		<Header bind:sidebar={sidebar}/>
		<Editor/>
	</section>
</div>


<style>	
	.main { width: 100%; height: 100%;}
	.content{ display: flex; flex-direction: row; align-items: center; justify-content: center;}
</style>
