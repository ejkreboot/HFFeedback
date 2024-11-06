<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase'; // adjust path as necessary
  import Svelecte from 'svelecte';
  import Evaluation from '$lib/Evaluation.svelte';

  export let data;
  const user = data.user;
  let selectedBlock, selectedRole, evaluatorName;
  let roles = [];
  let blocks = [];
  let residents = [];

  const getResidents = async function() {
    console.log(user);
    if(!selectedBlock || !selectedRole) {
      return([]);
    }
    const { data, error } = await supabase
      .from('masterschedulewithpgy')
      .select('resident, pgy')
      .eq("organization", user.organizationName, )
      .eq('role', selectedRole)
      .eq('block', selectedBlock);

      if (error) {
        console.log(error);
        residents = [];
      } else {
        residents = data;
      }
      console.log(residents);
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

    if (blockError) console.error("Error fetching blocks:", blockError);
    else blocks = blockData.map(item => item.block).sort(blockSort);
  });
</script>

<style>
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

  #evaluator {
    padding: 5px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #bbb;
    width: 275px;
    margin-left: 40px;
    margin-bottom: 30px;
    margin-top: 15px;
  }

  .name {
    max-width: 750px;
    width: 100%;
  }

  .flex_form {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding-left: 20px;
  }
</style>

<div class="container">
  <div class="title">
    Complete evaluations
  </div>
  <div class="body">
    To begin, select a rotation and schedule block.
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
  <div class="body">
    And please enter your name:
  </div>

  <div class="name">
    <input id="evaluator" placeholder="Your Name" required bind:value={evaluatorName}/>
  </div>


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
    institution={user.organizationName}
    role={selectedRole}
    block={selectedBlock}
    evaluator={evaluatorName} 
    subject={resident.resident} 
    pgy={resident.pgy}
  />
  {/each}  
</div>
