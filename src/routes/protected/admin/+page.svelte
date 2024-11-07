<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import Svelecte from 'svelecte';

  export let data;
  const user = data.user;
  let selectedBlock, selectedResident;
  let blocks = [];
  let evaluations = [];
  let residents = [];
  let averages = {};

  const getEvaluations = async function() {
    if(!selectedBlock || !selectedResident) {
      return([]);
    }
    const response = await fetch(`/api/protected/admin?resident_name=${encodeURIComponent(selectedResident)}&block=${encodeURIComponent(selectedBlock)}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
      } else {
        // Extract the data from the response
        data = await response.json();
      }

      evaluations = data.evaluations;
      if(data.evaluations.length > 0) {
        for(const key in evaluations[0]) {
          averages[key] = evaluations.reduce((a,b) => a + b[key], 0)/evaluations.length
        }
      }
  }

  $: if (selectedBlock && selectedResident) {
    getEvaluations();
  }

  onMount(async () => {
    let res;

    const nameSort = function(a, b) {
      const a_n = a.replace(/.*? (.*), .*/g, "$1")
      const b_n = b.replace(/.*? (.*), .*/g, "$1")
      return a_n.localeCompare(b_n);
    }

    const blockSort = function(a, b) {
      const a_n = parseInt(a.replace(/.*?([0-9]{1,2}).*/g, "$1"));
      const b_n = parseInt(b.replace(/.*?([0-9]{1,2}).*/g, "$1"));
      if(a_n == b_n) {
        res = 0;
      } else if(a_n > b_n) {
          res = 1
      } else {
          res = -1
      }
      return res;
    }

    const { data: residentData, error: residentError } = await supabase
      .from('Residents')
      .select('name')
      .order('name', { ascending: true });

    const { data: blockData, error: blockError } = await supabase
      .from('UniqueBlocks')
      .select('block')
      .order('block', { ascending: true });

    if (blockError) console.error("Error fetching roles:", blockError);
    else blocks = blockData.map(item => item.block).sort(blockSort);

    if (residentError) console.error("Error fetching residents:", residentError);
    else residents = residentData.map(item => item.name).sort(nameSort);

  });

</script>

<style>

  .evaluation_item {
    text-align: left;
    font-family: "Montserrat";
    color: black;
    border: 0px dotted gray;
    min-width: 100px;
    padding: 2px 5px 2px 0px;
    margin: 0px;
    font-weight: 300;
  }

  .evaluation_item.left {
    text-align: left;
  }

  .evaluation_container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .evaluation_container.averages {
    border-left: 14px solid #ffa500;
  }


  .evaluation_element_label {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: #ccc;
      font-weight: 600;
      font-size: 12px;
      padding: 0px 0px 5px 0px;
      min-height: 30px;
      max-height: 30px;
    max-width: 100px;
      margin-top: auto;
  }

  .evaluation_container {
    border-left: 15px solid #71bdf2;
    padding-left: 20px;
    margin-top: 40px;
    margin-bottom: 40px;
  }

  .wide {
    min-width: 100%;
  }

  .container {
    padding: 40px;
  }

  .title {
    font-family: Montserrat;
    font-size: 40px;
    padding-bottom: 10px;
    color: Orange;
  }

  .body {
    line-height: 60px;
  }

  div.body.section {
    max-height: 20px;
    color: #000;
    font-weight: 600;
    font-size: 20px;
  }

  .container {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .select {
    max-width: 300px;
    min-width: 300px;
    padding: 20px;
    font-size: 14px;
  }

  .flex_form {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding-left: 20px;
  }

  .noresults {
    padding-top: 20px;
    color: #0095f2;
  }

</style>

<div class="container">
  <div class="title">
    View evaluations
  </div>
  <div class="body">
    To begin, select a resident and schedule block.
  </div>
  <form class="flex_form">
    <div class="select">
      <Svelecte placeholder="Resident" 
                options={residents} 
                values={residents}
                bind:value={selectedResident} />
    </div>

    <div class="select">
      <Svelecte placeholder="Block" 
                options={blocks} 
                values={blocks}
                bind:value={selectedBlock} />
    </div>
  </form>

  {#if evaluations.length > 0}
  <div class="body section">
    Average scores (n = {evaluations.length})
  </div>
  <div class="evaluation_container averages">
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Evaluator
      </div>
      <div class="evaluation_item left">
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Rotation
      </div>
      <div class="evaluation_item left">
        
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        History and Physical
      </div>
      <div class="evaluation_item">
        {averages.history_and_physical}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Case Presentation
      </div>
      <div class="evaluation_item">
        {averages.case_presentation}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Management Plan
      </div>
      <div class="evaluation_item">
        {averages.management_plan}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Patient Communication
      </div>
      <div class="evaluation_item">
        {averages.patient_communication}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Documentation
      </div>
      <div class="evaluation_item">
        {averages.documentation}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Professionalism
      </div>
      <div class="evaluation_item">
        {averages.professionalism}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Leadership
      </div>
      <div class="evaluation_item">
        {averages.leadership}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Consultation
      </div>
      <div class="evaluation_item">
        {averages.consultation}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Procedures
      </div>
      <div class="evaluation_item">
        {averages.procedures}
      </div>
    </div>
  </div>
  <div class="body section">
    Individual evaluations
  </div>
  {:else}
  <div class="noresults">
  No evaluations have been completed for that resident and block yet.
  </div>
{/if}

  {#each evaluations as evaluation}
  <div class="evaluation_container">
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Evaluator
      </div>
      <div class="evaluation_item left">
        {evaluation.evaluator}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Rotation
      </div>
      <div class="evaluation_item left">
        {evaluation.rotation}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        History and Physical
      </div>
      <div class="evaluation_item">
        {evaluation.history_and_physical}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Case Presentation
      </div>
      <div class="evaluation_item">
        {evaluation.case_presentation}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Management Plan
      </div>
      <div class="evaluation_item">
        {evaluation.management_plan}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Patient Communication
      </div>
      <div class="evaluation_item">
        {evaluation.patient_communication}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Documentation
      </div>
      <div class="evaluation_item">
        {evaluation.documentation}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Professionalism
      </div>
      <div class="evaluation_item">
        {evaluation.professionalism}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Leadership
      </div>
      <div class="evaluation_item">
        {evaluation.leadership}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Consultation
      </div>
      <div class="evaluation_item">
        {evaluation.consultation}
      </div>
    </div>
    <div class="evaluation_element">
      <div class="evaluation_element_label">
        Procedures
      </div>
      <div class="evaluation_item">
        {evaluation.procedures}
      </div>
    </div>
    <div class="evaluation_element wide">
      <div class="evaluation_element_label">
        Comments
      </div>
      <div class="evaluation_item left">
        {evaluation.comments}
      </div>
    </div>
  </div>
  {/each}  
</div>
