<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase'; // adjust path as necessary
    import Svelecte from 'svelecte';
    export let subject, 
               role, 
               block, 
               pgy, 
               evaluator, 
               institution, 
               button,
               professionalism,
               leadership, 
               consultation, 
               procedures;

    let image_path = ''; 

    let message = "", 
        history_and_physical = null,
        case_presentation = null,
        management_plan = null, 
        patient_communication = null, 
        documentation = null,
        comments = null,
        initialData = {
            case_presentation: null,
            comments: null,
            documentation: null,
            history_and_physical: null,
            management_plan: null,
            patient_communication: null,
            professionalism: null,
            leadership: null,
            consultation: null,
            procedures: null
        }

    const getEvaluation = async function() {
      const { data, error } = await supabase
        .from('Evaluations')
        .select('*')
        .eq('evaluator', evaluator )
        .eq('resident_name', subject)
        .eq('block', block)
        .eq('rotation', role);
        if(data[0]) {
          ({case_presentation, 
            comments, 
            documentation, 
            history_and_physical, 
            management_plan, 
            patient_communication,
            professionalism,
            leadership,
            consultation,
            procedures
           } = data[0]);

          initialData = { ...data[0] };

        } else {
          initialData = {
            case_presentation: null,
            comments: null,
            documentation: null,
            history_and_physical: null,
            management_plan: null,
            patient_communication: null,
            professionalism: null,
            leadership: null,
            consultation: null,
            procedures: null
          }
        }
    }

    $: if (evaluator) {
      getEvaluation();
    }

    $: isDirty = (
      case_presentation !== initialData?.case_presentation ||
      comments !== initialData?.comments ||
      documentation !== initialData?.documentation ||
      history_and_physical !== initialData?.history_and_physical ||
      management_plan !== initialData?.management_plan ||
      patient_communication !== initialData?.patient_communication ||
      professionalism !== initialData?.professionalism ||
      leadership !== initialData?.leadership ||
      consultation !== initialData?.consultation ||
      procedures !== initialData?.procedures
    );

    $: {
    if (isDirty) {
        message = "<span style='color: red;'>You have unsaved changes →</span>";
      } else {
        message = "";
      }
    }

    onMount(async () => 
    {
      const { data, error } = await supabase
      .from('Residents')
      .select('image_path')
      .eq('name', subject)
      .single(); 

      await getEvaluation();
      if (error) {
        console.error('Error fetching image path:', error.message);
      } else {
        image_path = data?.image_path || '';
      }

      button.addEventListener('click', async () => {
        if(!evaluator) {
          message = '<span style="color: red; font-weight: 900;">Please enter your name above.</span>'
          return;
        }
        
        const record = {
          institution: institution,
          evaluator: evaluator,
          resident_name: subject,
          rotation: role,
          block: block,
          history_and_physical: history_and_physical,
          case_presentation: case_presentation,
          management_plan: management_plan,
          patient_communication: patient_communication,
          documentation: documentation,
          professionalism: professionalism,
          leadership: leadership,
          consultation: consultation,
          procedures: procedures,
          comments: comments
        };

        const { error } = await supabase.from('Evaluations').insert([record]);
        if (error) {
          console.error('Error saving evaluation:', error);
          message = 'An error occurred while saving the evaluation.';
        } else {
          message = '<span style="color: green;">Evaluation saved. Thank you!</span>';
        }
      });
    });
</script>

<style>

  @media (min-width: 499px) {
    img {
      border: 1px solid gray;
      box-shadow:  0.3px 0.5px 0.6px hsl(0deg 0% 0% / 0.11),
      0.7px 1.5px 1.8px -0.9px hsl(0deg 0% 0% / 0.1),
      1.9px 3.8px 4.6px -1.9px hsl(0deg 0% 0% / 0.1),
      4.7px 9.5px 11.4px -2.8px hsl(0deg 0% 0% / 0.09);
    }

    textarea {
      padding: 10px;
      font-family: "Montserrat";
      font-size: 14px;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding: 10px 0px 10px 0px;
      max-width: 700px;
      width: 700px;
    }

    .col.wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      max-width: 595px;
    }

    .eval_question_container {
        padding-left: 5px;
    }

    .evaluation_name_container {
      display: flex;
      flex-flow: wrap;
      border-top: 1px solid gray;
      margin-top: 20px;
      padding: 10px 0px 20px 0px;
      width: 100%;
      max-width: 750px;
    }

    .evaluation_name_container button {
      margin-left: auto;
      border: 1px solid #0095f2;
      font-weight: 300;
      font-size: 12px;
      border-radius: 3px;
      padding: 5px;
      background: #dbecf7;
    }

    .evaluation_name {
      color: #0095f2;
      font-size: 24px;
      font-weight: 300;
      flex-grow:1
    }

    .label {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: gray;
      font-weight: 300;
      font-size: 12px;
      padding: 0px 0px 5px 0px;
      min-height: 30px;
      max-height: 30px;
      margin-top: auto;
    }

    .wide > .label {
      padding-bottom: 10px;
      min-height: 0px;
    }

    .wide > textarea {
      width: 100%;
      max-width: 700px;
    }

    .short {
      flex: 1 1 100px;
      max-width: 100px;
    }

    .eval_photo {
      flex: 1 1 100px;
      max-width: 100px;
    }

    .eval_photo > img {
      width: 80px;
      height: 90px;
      overflow: hidden;
      object-fit: cover;
      object-position: top;
      border-radius: 10px;
    }

    .wide {
        flex-basis: 100%; /* Takes full width */
        margin-top: 8px; /* Space between rows */
    }

    [data-tooltip]::after {
      content: attr(data-tooltip);
      font-size: 14px;
      position: absolute;
      display: block;
      z-index: 1000;
      max-width: 300px;
      padding: 5px 10px;
      background-color: #fff;
      color: #000;
      border: 1px solid #0095f2;
      border-radius: 4px;
      opacity: 0; 
      pointer-events: none;
      transition: opacity 0.5s ease;
      transition-delay: 0s; /* Delay before tooltip appears */
    }

    [data-tooltip]:hover::after {
      opacity: 1; 
      transition-delay: 0.5s; 
    }

    .message {
      font-size: 12px;
      font-weight: 300;
      color: gray;
      padding: 5px;
    }
  }

  @media (max-width: 499px) {
    img {
      border: 1px solid gray;
      box-shadow:  0.3px 0.5px 0.6px hsl(0deg 0% 0% / 0.11),
      0.7px 1.5px 1.8px -0.9px hsl(0deg 0% 0% / 0.1),
      1.9px 3.8px 4.6px -1.9px hsl(0deg 0% 0% / 0.1),
      4.7px 9.5px 11.4px -2.8px hsl(0deg 0% 0% / 0.09);
    }

    textarea {
      padding: 10px;
      font-family: "Montserrat";
      font-size: 14px;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding: 10px 0px 10px 0px;
      max-width: 100%;
    }

    .col.wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      max-width: 100%;
    }

    .eval_question_container {
        padding-left: 5px;
    }

    .evaluation_name_container {
      display: flex;
      flex-flow: wrap;
      border-top: 1px solid gray;
      margin-top: 20px;
      padding: 10px 0px 20px 0px;
      width: 100%;
      justify-content: end;
    }

    .evaluation_name_container button {
      margin-left: auto;
      border: 1px solid #0095f2;
      font-weight: 300;
      font-size: 12px;
      border-radius: 3px;
      padding: 5px;
      background: #dbecf7;
    }

    .evaluation_name {
      color: #0095f2;
      font-size: 24px;
      font-weight: 300;
      flex-grow:1
    }

    .label {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: gray;
      font-weight: 300;
      font-size: 12px;
      padding: 0px 0px 5px 0px;
      min-height: 30px;
      max-height: 30px;
      margin-top: auto;
    }

    .wide > .label {
      padding-bottom: 10px;
      min-height: 0px;
    }

    .wide > textarea {
      width: 90%;
    }

    .short {
      flex: 1 1 100px;
      max-width: 40%;
    }

    .eval_photo {
      flex: 1 1 100px;
      max-width: 100px;
    }

    .eval_photo > img {
      width: 80px;
      height: 90px;
      overflow: hidden;
      object-fit: cover;
      object-position: top;
      border-radius: 10px;
    }

    .wide {
        flex-basis: 100%; /* Takes full width */
        margin-top: 8px; /* Space between rows */
    }

    [data-tooltip]::after {
      content: attr(data-tooltip);
      position: absolute;
      display: block;
      z-index: 1000;
      max-width: 300px;
      padding: 5px 10px;
      background-color: #fff;
      color: #0095f2;
      border: 1px solid #0095f2;
      border-radius: 4px;
      opacity: 0; 
      pointer-events: none;
      transition: opacity 0.5s ease;
      transition-delay: 0s; /* Delay before tooltip appears */
    }

    [data-tooltip]:hover::after {
      opacity: 1; 
      transition-delay: 0.5s; 
    }

    .message {
      font-size: 12px;
      font-weight: 300;
      color: gray;
      padding: 12px;
    }

    button {
      margin-top: 10px;
    }
  }

</style>

<div class="evaluation_name_container">
  <div class="evaluation_name">{subject} (PGY {pgy})</div>
  <div class="message">{@html message}</div>
  <div><button bind:this={button} aria-label="submit evaluation" id="evaluation_submit">submit evaluation</button></div>
</div>

<div class="eval_question_container">
  <div class="row">
    <div class="col">
      <div class="eval_photo">
        <img
        src={image_path}
        alt="headshot" />
      </div>
    </div>  
    <div class="col wrap">
      <div class="eval_question short">
        {#if pgy == 1}
          <div class="label" data-tooltip="Efficiently gather, prioritize, and synthesize patient history to deveop
          differential diagnosis. Performs complete and focused physical exams and inteprets normal variants ane abnormal
          findings.">
            History & Physical
          </div> 
        {:else }
          <div class="label" data-tooltip="Perform a directed physical exam, prioritizing important historical 
          and physical exam data. Formulate a differential diagnosis to determine and prioritize most likely 
          diagnoses.">
            History & Physical
          </div> 
        {/if}
        <Svelecte options={[1,2,3,4,5]} bind:value={history_and_physical} />
      </div>
      <div class="eval_question short">
        {#if pgy == 1}
          <div class="label" data-tooltip="Clearly presents and begins to intepret and manage patient information. Show
          ability to formulate and commit to an assessment based on data presented.">
            Case Presentation
          </div> 
        {:else }
          <div class="label" data-tooltip="Clearly presents interprets, and manages patient information. Shows
          ability and also teaches junior colleagues to formulat and commit to an assessment based on data 
          presented.">
            Case Presentation
          </div> 
        {/if}
        <Svelecte class="select"  options={[1,2,3,4,5]} bind:value={case_presentation} />
      </div>
      <div class="eval_question short">
        {#if pgy == 1}
        <div class="label" data-tooltip="Able to develop relevant evidence-based and cost-effective diagnostic and therapeutic
        plans and follow up in a timely fashion on labs/consultations, and frequently reassesses patients.">
          ManagementPlan & Execution
        </div> 
        {:else }
        <div class="label" data-tooltip="Able to coach interns on relevant evidence-based and cost-effective 
        diagnostic and therapeutic plans (i.e. appropriate labs, images, procecures, etc.); role models timely 
        follow up on labs/consultations, frequent reassessments of patients. Delegates admissions and manages 
        mutiple patients effectively.">
          ManagementPlan & Execution
        </div>
        {/if}
        <Svelecte class="select"  options={[1,2,3,4,5]} bind:value={management_plan} />
      </div>
      <div class="eval_question short">
        <div class="label" data-tooltip="Effective, sensitive, and respectful communication skills, langauge appropriate to
        patient/family understanding, able to build rapport and trust, engagement of family/patient in chared decision
        making.">
          Patient/Family Communication
        </div> 
        <Svelecte class="select"  options={[1,2,3,4,5]} bind:value={patient_communication} />
      </div>
      <div class="eval_question short">
        <div class="label" data-tooltip="Efficient, succinct, timely, and includes rationale behind medical decision
        making.">
          Documentation
        </div>
        <Svelecte class="select"  options={[1,2,3,4,5]} bind:value={documentation} />
      </div>
      <div class="eval_question short">
        {#if pgy == 1}
          <div class="label" data-tooltip="Works well with and/or teaches other team members (peers, NPs, RNs, RTs, 
          pharmacists, nutritionists, consultants, medical students, etc.), engage team members to utilize their 
          expertise and shows value for their contribution.">
            Professionalism / Collaboration
          </div>
        {:else}
          <div class="label" data-tooltip="Works well with and/or teaches other team members (peers, NPs, RNs, RTs, 
          pharmacists, nutritionists, consultants, medical students, etc.), engage team members to utilize their 
          expertise and shows value for their contribution. Encourages graded autonomy of junior colleagues.">
            Professionalism / Collaboration
          </div>
        {/if}
        <Svelecte class="select"  options={[1,2,3,4,5]} bind:value={professionalism} />
      </div>
      <div class="eval_question short">
        <div class="label" data-tooltip="Demonstrates situational awareness, shows self-motivation to go above 
        and beyond the minimum expectations of the rotation.">
          Leadership / Motivation
        </div>
        <Svelecte class="select"  options={[1,2,3,4,5]} bind:value={leadership} />
      </div>
      <div class="eval_question short">
        <div class="label" data-tooltip="Makes appropriate consultations, able to formulate relevant questions 
        for consultants, appropriate post-referral follow up.">
          Consultation
        </div>
        <Svelecte class="select"  options={[1,2,3,4,5]} bind:value={consultation} />
      </div>
      <div class="eval_question short">
        <div class="label" data-tooltip="Discusses risks/benefits of procedures in language easilt understood 
        by family, engages in time-out, follows proper sterile technique, demonstrates adequate procedural 
        skills.">
          Procedural skills
        </div>
        <Svelecte class="select"  options={[1,2,3,4,5]} bind:value={procedures} />
      </div>
      <div class="eval_question wide">
        <div class="label"><b>Please comment on at least 1 strength and growth opportunity, and the rationale behind your
        scores.</b></div>
        <textarea rows=4 id="comments" bind:value={comments}></textarea>
      </div>
    </div>
  </div>
</div>
