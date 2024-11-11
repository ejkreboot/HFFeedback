<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import Svelecte from 'svelecte';
  import Evaluation from '$lib/Evaluation.svelte';
  import { session } from '$stores/session.js';

  let selectedBlock, selectedRole, evaluatorName;
  let roles = [];
  let blocks = [];
  let residents = [];

  const getResidents = async function() {
    if(!selectedBlock || !selectedRole) {
      return([]);
    }
    const { data: rows, error } = await supabase
      .from('masterschedulewithpgy')
      .select('resident, pgy')
      .eq("organization", $session.institution, )
      .eq('role', selectedRole)
      .eq('block', selectedBlock);

      if (error) {
        residents = [];
      } else {
        residents = rows;
      }
  }

  $: if (selectedBlock && selectedRole) {
    getResidents();
  }

  // Fetch sorted, unique roles and blocks
    onMount(async () => {

      let res;
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

    const { data: roleData, error: roleError } = await supabase
      .from('UniqueRoles')
      .select('role')
      .order('role', { ascending: true });
      
    const { data: blockData, error: blockError } = await supabase
      .from('UniqueBlocks')
      .select('block')
      .order('block', { ascending: true });

    if (roleError) console.error("Error fetching roles:", roleError);
    else roles = roleData.map(item => item.role);
    roles = roles.filter(item => $session.roles.some(role => item.startsWith(role)));

    if (blockError) console.error("Error fetching blocks:", blockError);
    else blocks = blockData.map(item => item.block).sort(blockSort);
  });
</script>

<style>
  :global(.sv-dropdown-scroll) {
    cursor: default;
  }

   @media (min-width: 499px) {
    .container {
      padding: 0px 40px 40px 40px;
    }

    .body {
      line-height: 60px;
    }

    .row {
      display: flex;
      flex: wrap;
      gap: 20px;
      padding: 10px 0px 10px 0px;
    }

    .row p {
      padding: 5px;
      margin: 0px;
      line-height: 25px;
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

    .evaluation_metrics {
      border-top: 3px solid gray;
      margin: 20px 0px 10px 0px;
      padding: 10px 0px 20px 10px;
      width: 100%;
      max-width: 750px;
      font-weight: 300;
      line-height: 24px;
      font-size: 14px;
    }

    .flex_form {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        padding-left: 20px;
    }
  }

  @media (max-width: 499px) {
    .container {
      padding: 5px;
    }

    .body {
      line-height: 40px;
    }

    .row {
      display: flex;
      flex: wrap;
      gap: 20px;
      padding: 10px 0px 10px 0px;
    }

    .row p {
      padding: 5px;
      margin: 0px;
      line-height: 20px;
    }

    .container {
      max-width: 100%;
    }

    .select {
      max-width: 300px;
      min-width: 80%;
      padding: 5px;
      font-size: 14px;
    }

    .evaluation_metrics {
      border-top: 3px solid gray;
      margin: 20px 0px 10px 0px;
      padding: 10px 0px 20px 10px;
      width: 100%;
      max-width: 100%;
      font-weight: 300;
      line-height: 24px;
      font-size: 14px;
    }

    .flex_form {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        padding-left: 20px;
    }
  }

</style>

<div class="container">
  <h2>
    Complete evaluations
  </h2>
  <div class="body">
    Evaluator: <b> { $session.name } </b>. To begin, select a rotation and schedule block.
  </div>
  <form class="flex_form">
    <div class="select">
      <Svelecte placeholder="Rotation" 
                options={roles} 
                values={roles}
                bind:value={selectedRole} />
    </div>

    <div class="select">
      <Svelecte placeholder="Block" 
                options={blocks} 
                values={blocks}
                bind:value={selectedBlock} />
    </div>  
  </form>

  <div class="evaluation_metrics">
    Please provide your assessment based on <b>your direct observation</b> of the resident's <b>progress</b> towards being able
    to <b>independently</b> provide patient care. Your feedback should be reflective of what you have already communicated to the
    resident <b>in person</b>.
    <div class="row">
      <div class="col">
        <p><b>1</b> = Not entrusted (critical deficiencies)</p> 
        <p><b>2</b> = Entrusted with direct supervision</p> 
        <p><b>3</b> = Entrusted with indirect supervision</p>   
      </div>
      <div class="col">
        <p><b>4</b> = Entrusted with no supervision</p> 
        <p><b>5</b> = Entrusted at aspirational level. </p>         
      </div>
    </div>
  Please provide narrative justification for scores other than 3 (especially if giving a score of 1 or 5).
  </div>

  {#each residents as resident (resident.resident)}
  <Evaluation 
    institution={$session.institution}
    role={selectedRole}
    block={selectedBlock}
    evaluator={$session.name} 
    subject={resident.resident} 
    pgy={resident.pgy}
  />
  {/each}  
</div>
