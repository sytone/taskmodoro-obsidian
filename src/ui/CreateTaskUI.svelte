<script lang="ts">
  import RepeatPicker from './RepeatPicker.svelte';
  import DuePicker from './DuePicker.svelte';
  import { externalLink } from '../graphics';
  import { Component, MarkdownRenderer } from 'obsidian';
  import type { Moment } from 'moment';
  import type { App, TextAreaComponent } from 'obsidian';
  import TextSuggest from './TextSuggest.svelte';
  import { afterUpdate, onMount } from 'svelte';
  import TaskDetailsMainPanel from './TaskDetailsMainPanel.svelte';
  import { DuePickerModal, RepeatPickerModal } from '../modals';
  import TaskDetailsSidebar from './TaskDetailsSidebar.svelte';

  export let close: () => void;
  export let store: (
    taskName: string,
    description: string,
    due: string,
    scheduled: string,
    repeat: string,
    tags: string[],
  ) => void;
  export let app: App;

  const tagCache = Object.keys((app.metadataCache as any).getTags());
  let taskName = '';
  let description = '';
  let repeats = false;
  let repeatConfig = 'None';
  let due = '';
  let scheduled = '';
  let tags = '';

  const onCreate = () => {
    const cleanedTags = tags
      .split(/[, ]/)
      .filter((x) => x !== '')
      .map((tag) => tag.trim().replace('#', ''));

    store(
      taskName,
      description,
      due,
      scheduled,
      repeats ? repeatConfig : '',
      cleanedTags,
    );

    close();
  };

  // TODO: Allow setting arbitrary fields in this form, configured in settings
</script>

<TaskDetailsMainPanel
  isNewTask={true}
  completed={false}
  bind:description
  bind:taskName
/>
<TaskDetailsSidebar
  bind:due
  bind:taskName
  bind:scheduled
  bind:repeatConfig
  {app}
  {onCreate}
/>
<style>
</style>
