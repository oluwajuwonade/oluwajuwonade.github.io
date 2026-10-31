(function () {
'use strict';

const STORAGE_KEY = 'skillforge:academy:v1';
const PASS_MARK = 75;
const BRAND = { navy:'#02021B', cyan:'#10D9F1', blue:'#389BFF', indigo:'#6668FF', violet:'#A12BFF' };

const L = function(id,title,objective,concept,example,practice,deliverable,question,choices,answer,explanation,skills,resource) {
  return {id:id,title:title,minutes:18,objective:objective,concept:concept,example:example,practice:practice,deliverable:deliverable,
    check:{question:question,choices:choices,answer:answer,explanation:explanation},skills:skills||[],resource:resource||null};
};
const M = function(id,title,outcomes,lessons) { return {id:id,title:title,outcomes:outcomes,lessons:lessons}; };
const C = function(id,title,description,prerequisites,modules) { return {id:id,title:title,description:description,prerequisites:prerequisites||[],modules:modules}; };

const schools = [
  {
    id:'data',name:'Data Analytics & Business Intelligence',short:'Data & BI',
    summary:'Turn raw operational data into validated analysis, useful metrics and decision-ready reporting.',
    audience:'Beginners and developing analysts who want to build spreadsheet, SQL, statistical and BI capability.',
    programme:{id:'data-analytics',title:'Applied Data Analytics & BI Programme',level:'Foundation to applied',hours:56,
      entry:'No formal prerequisite. Basic computer and spreadsheet familiarity is useful; all technical concepts are introduced progressively.',
      outcomes:['Frame business questions and define measurable outcomes.','Prepare, validate and analyse structured datasets.','Use SQL concepts to extract and aggregate information.','Select effective visualisations and communicate decisions.','Produce a reproducible analytical case study.'],
      competencies:['Problem framing','Spreadsheet modelling','Data quality','SQL reasoning','Statistical analysis','Data visualisation','Decision communication'],
      courses:[
        C('da-foundations','Data Analysis Foundations','Problem framing, spreadsheet workflows, data quality and descriptive analysis.',[],[
          M('da-f1','Analytical thinking and measurement',['Translate a decision into an analytical question.','Define metric, population, time period and grain.'],[
            L('da-question','Start with a decision question','Identify the decision owner, decision, alternatives and evidence needed.','A useful analytical question is narrow enough to investigate and important enough to inform a decision. Separate the outcome to explain from possible drivers. Define the population and time window before choosing a tool.','A retailer asks why gross margin fell. The question is not “make a sales chart”; it is “which products, channels or cost changes explain the margin movement this quarter?”','Write one question for a business, economic or public-service decision. Name the decision owner, outcome, unit of analysis and period.','A one-paragraph problem statement with the decision, outcome, population and period.','Which question is most decision-useful?',['How many charts can we make?','Which products explain the change in gross margin this quarter?','Can we use Python?','What colour should the dashboard use?'],1,'The second option identifies an outcome and a decision-relevant explanation. Tool choice and chart count are implementation details, not the problem definition.',['Problem framing','Decision communication'],'https://www.gov.uk/service-manual/agile-delivery/how-to-write-good-user-stories'),
            L('da-metric-contract','Define metrics and data grain','Specify a metric so that another analyst can reproduce it consistently.','A metric contract defines the name, business meaning, numerator, denominator, unit, population, exclusions, time basis and source. Grain describes what one row represents. Ambiguous definitions create inconsistent reporting even when the arithmetic is correct.','Revenue may mean orders placed, invoices issued or cash received. Monthly revenue should also specify currency, refunds, tax treatment and the date field used.','Define revenue, average order value and gross margin for an online retailer. State the grain of the transaction table.','A compact metric dictionary containing three measures and one grain statement.','What does a metric contract primarily prevent?',['Inconsistent definitions and comparisons','Slow internet access','Too many colours in a report','The need to document data sources'],0,'A metric contract aligns meaning and calculation across analysts, teams and reporting periods.',['Problem framing','Spreadsheet modelling'],'https://learn.microsoft.com/en-us/power-bi/guidance/star-schema')
          ]),
          M('da-f2','Spreadsheet preparation and descriptive analysis',['Inspect raw data before analysis.','Calculate and validate simple descriptive measures.'],[
            L('da-clean','Clean a spreadsheet systematically','Identify missing values, duplicates, inconsistent types and invalid categories.','Data preparation should be reproducible. Preserve a raw copy, profile fields, define cleaning rules, apply transformations, and record rows removed or amended. Never silently replace unknown values with zero.','If “Lagos”, “lagos” and “LAGOS ” represent the same category, standardise with a documented rule and compare counts before and after.','Inspect a sample CSV or spreadsheet. List missingness, duplicate keys, type issues and inconsistent labels before changing anything.','A data-quality log with issue, affected field, rule, impact and validation check.','A blank value in a sales column should usually be handled by:',['Replacing it with zero automatically','Deleting the entire dataset','Investigating why it is missing and applying a documented rule','Renaming the column'],2,'A missing value may mean not recorded, not applicable or unknown. Its meaning must be understood before imputation or exclusion.',['Data quality','Spreadsheet modelling'],'https://pandas.pydata.org/docs/user_guide/missing_data.html'),
            L('da-describe','Summarise data without hiding variation','Use counts, totals, averages, medians, ranges and grouped summaries appropriately.','Descriptive statistics summarise observed data; they do not explain causality. Compare mean and median when distributions may be skewed. Always show denominators, time periods and units when presenting rates or averages.','A few unusually large invoices can pull the mean order value above the median. Reporting both helps stakeholders understand a typical order and the influence of large transactions.','Calculate row count, missing count, mean, median and group totals for a dataset. Explain one case where the median is more informative.','A short descriptive profile with calculations and interpretation.','When is the median often preferable to the mean?',['When every value is identical','When a distribution is skewed by extreme values','When the data has no units','When a causal effect is required'],1,'The median is less sensitive to extreme observations and can better represent the centre of a skewed distribution.',['Statistical analysis','Data quality'],'https://www.itl.nist.gov/div898/handbook/')
          ])
        ]),
        C('da-bi','SQL, Visualisation & Decision Support','Query relational data, build useful visuals and communicate an evidence-based recommendation.',['da-foundations'],[
          M('da-bi1','Relational data and SQL',['Explain table grain and primary/foreign keys.','Filter, group and join tables conceptually.'],[
            L('da-grain','Understand tables, keys and grain','Explain why joins require a clear relationship between tables.','A relational dataset stores entities in linked tables. Primary keys identify rows; foreign keys connect records. Before joining, check uniqueness and table grain to avoid accidental row multiplication.','One order has many order lines. Joining orders to order lines changes the grain from one row per order to one row per order line. Order totals must not be summed from repeated order-level values.','Draw a simple orders, order_lines and products relationship. Mark primary keys, foreign keys and the grain of each table.','A relationship diagram and a short explanation of join cardinality.','What is the main risk when joining a one-to-many table?',['A query cannot contain filters','Rows may multiply and inflate aggregates','Primary keys become encrypted','The database loses its schema'],1,'A one-to-many join repeats the one-side record for each matching many-side record. Aggregations must respect the resulting grain.',['SQL reasoning','Data quality'],'https://www.postgresql.org/docs/current/tutorial.html'),
            L('da-sql-aggregate','Filter, aggregate and join with SQL','Read and design SELECT queries that filter, group and combine data.','SQL analysis typically follows SELECT, FROM, JOIN, WHERE, GROUP BY and HAVING. WHERE filters source rows before aggregation; HAVING filters grouped results. Explicit join keys and selected columns improve auditability.','To find monthly revenue by region, join order headers to order lines, filter valid orders, group by month and region, and sum line revenue once at the line grain.','Write a query that totals sales by region for a specified year. Add a HAVING condition for regions above a chosen threshold.','A readable SQL query plus a sentence describing the expected grain of its output.','Which clause filters groups after aggregation?',['WHERE','ORDER BY','HAVING','FROM'],2,'HAVING is evaluated against grouped results; WHERE filters rows before grouping.',['SQL reasoning','Statistical analysis'],'https://www.postgresql.org/docs/current/tutorial-agg.html')
          ]),
          M('da-bi2','Visual analysis and decision reporting',['Match charts to analytical questions.','Communicate findings, caveats and recommended action.'],[
            L('da-chart-choice','Choose a chart for the comparison','Select visual encodings that match the question and data type.','Use lines for ordered time trends, bars for categorical comparisons, scatter plots for relationships and distributions for spread. Avoid implying continuity or precision that the data does not support.','A monthly revenue trend is usually clearer as a line chart; ranking five product categories is usually clearer as a sorted bar chart.','Choose a chart for a time trend, category ranking and two-variable relationship. Explain one chart type you would avoid for each.','A visual specification naming chart, axis, unit, grouping and intended message.','A sorted category ranking is most directly communicated with:',['A pie chart with many slices','A sorted bar chart','A map without geographic meaning','A decorative gauge'],1,'A sorted bar chart makes differences and ranking across categories easy to compare.',['Data visualisation','Decision communication'],'https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-report-visualizations'),
            L('da-brief','Write an evidence-based decision brief','Connect a finding to the decision while disclosing limitations.','A strong analytical brief states the question, method, key finding, evidence, interpretation, recommendation and limitations. Separate observed facts from hypotheses. Make the next action proportionate to the strength of the evidence.','“Margin declined by 2.4 percentage points, concentrated in two categories” is an observation. “Supplier pricing caused the decline” is a hypothesis until purchase-cost evidence supports it.','Write a 150-word executive summary from a small analysis. Include one quantified finding, one caveat and one recommended next step.','A concise decision memo with source, date, method, result and action.','Which statement best separates evidence from interpretation?',['The campaign caused the increase because sales rose','Sales rose 8% after the campaign; other changes were not controlled','The chart proves the strategy worked','The team feels performance improved'],1,'The second statement reports an observed change and explicitly acknowledges that causality has not been established.',['Decision communication','Data visualisation'],'https://www.gov.uk/government/publications/the-magenta-book')
          ])
        ])
      ],
      resources:[
        ['Microsoft Excel help and learning','https://support.microsoft.com/excel'],
        ['PostgreSQL SQL tutorial','https://www.postgresql.org/docs/current/tutorial.html'],
        ['pandas user guide','https://pandas.pydata.org/docs/user_guide/index.html'],
        ['Microsoft Power BI documentation','https://learn.microsoft.com/en-us/power-bi/']
      ],
      capstone:'Produce a reproducible business analysis: documented question, cleaned data, metric definitions, SQL or spreadsheet calculations, one clear visual and a decision brief with limitations.'
    }
  },
  {
    id:'ai',name:'Artificial Intelligence & Automation',short:'AI & Automation',
    summary:'Build, test and govern useful AI-assisted workflows instead of relying on prompt tricks or tool demonstrations.',
    audience:'Learners who want to use generative AI responsibly and automate repeatable knowledge or data workflows.',
    programme:{id:'applied-ai',title:'Applied AI & Workflow Automation Programme',level:'Foundation to applied',hours:48,
      entry:'No programming prerequisite for the first course. Basic Python familiarity is introduced in the automation course.',
      outcomes:['Explain what generative AI systems can and cannot reliably do.','Design prompts with context, constraints and evaluation criteria.','Verify AI-assisted research against primary sources.','Map and automate repeatable workflows.','Evaluate quality, privacy, risk and failure modes.'],
      competencies:['AI fundamentals','Prompt design','Source verification','AI evaluation','Workflow design','Python automation','Responsible AI'],
      courses:[
        C('ai-foundations','Generative AI and Research Practice','Understand model behaviour, prompt design and evidence-based AI-assisted research.',[],[
          M('ai-m1','Model concepts and task framing',['Describe probabilistic generation and model limitations.','Choose tasks suitable for AI assistance.'],[
            L('ai-models','What generative models do','Explain next-token generation and why fluent output is not proof of correctness.','Generative models produce outputs based on learned patterns and the input context. They can be useful for drafting, classification and synthesis, but may produce unsupported claims, stale facts or fabricated citations.','A model can write a plausible summary of a policy but still misstate its effective date. The output must be checked against the original policy document.','List three tasks where AI can accelerate work and two tasks that require independent verification before use.','A task suitability matrix covering value, error cost and verification method.','Why can a fluent AI answer still be incorrect?',['Fluency guarantees factual accuracy','A model generates plausible output and may lack verified evidence','The model always checks live websites','All language models use the same sources'],1,'Language fluency is not equivalent to factual grounding. Model outputs require appropriate validation.',['AI fundamentals','AI evaluation'],'https://platform.openai.com/docs/guides'),
            L('ai-prompt','Design prompts with explicit constraints','Construct prompts that define objective, context, inputs, output and quality tests.','A useful prompt specifies the task, relevant context, source boundaries, constraints, output format and evaluation criteria. Decompose multi-stage tasks and request uncertainty or missing information instead of encouraging unsupported completion.','For a research brief, specify geography, period, source hierarchy, metric definitions, citation format and a rule to say “not found” when evidence is unavailable.','Improve a vague prompt such as “analyse this market” into a structured prompt with context, scope, source rules and output requirements.','A reusable prompt template and an example of an expected output.','Which prompt element most directly defines how success will be judged?',['A longer greeting','Evaluation criteria and acceptance tests','A request for confident tone','More decorative formatting'],1,'Acceptance criteria define observable quality and make the result reviewable.',['Prompt design','AI evaluation'],'https://platform.openai.com/docs/guides/prompt-engineering')
          ]),
          M('ai-m2','Research verification and evaluation',['Trace claims to primary sources.','Evaluate answer quality with a repeatable rubric.'],[
            L('ai-source-check','Verify AI-assisted research','Check the original source, publication date, methodology and exact claim.','A citation is useful only when it supports the statement attached to it. Open the source, inspect the relevant section, compare dates and definitions, and distinguish reported data from the model’s interpretation.','A press release may report a forecast while a statistical office publishes observed data. A report should label forecast and observed values separately.','Take three factual claims from an AI-generated paragraph and verify each against a primary or authoritative source.','A claim-source audit with source URL, date, supporting passage and verification status.','What is the strongest verification step for a cited claim?',['Trust the URL title','Confirm that the source itself supports the exact claim','Check whether the answer sounds professional','Count how many links are included'],1,'The original source must be inspected for the exact claim, period and meaning.',['Source verification','AI evaluation'],'https://www.nist.gov/itl/ai-risk-management-framework'),
            L('ai-evaluate','Score an AI workflow with a rubric','Evaluate completeness, accuracy, traceability, consistency and failure risk.','Define quality dimensions before running a workflow. Use representative examples, reference answers where possible, severity-weighted error categories and human review for high-impact decisions. Monitor latency, cost and repeatability where those matter.','A research assistant can be scored for factual accuracy, citation support, coverage of required topics, date accuracy and whether uncertainty is disclosed.','Build a five-dimension evaluation sheet and test the same workflow on at least five varied examples.','An evaluation rubric, test set, score summary and documented failure cases.','Why should evaluation cases include varied examples?',['To make the average score larger','To expose edge cases and inconsistent behaviour','To avoid recording failures','To prove the tool is unbiased'],1,'A varied test set helps reveal failure modes that a narrow or convenient sample can hide.',['AI evaluation','Responsible AI'],'https://www.nist.gov/itl/ai-risk-management-framework')
          ])
        ]),
        C('ai-automation','Automation and Responsible AI','Map processes, build simple scripts and validate automated outputs.', ['ai-foundations'],[
          M('ai-auto1','Workflow analysis and design',['Identify repetitive workflow steps and failure points.','Design human review and exception handling.'],[
            L('ai-process-map','Map a workflow before automating it','Represent triggers, inputs, transformations, decisions and outputs.','Automation should begin with a stable process map. Record who provides each input, what rules are applied, where exceptions arise and who is accountable for final approval. Automating a poorly defined process makes defects faster.','A monthly reporting workflow may include source download, validation, cleaning, KPI calculation, review and publication. Each step needs an owner and a check.','Map a repeated research or reporting task. Mark manual handoffs, data dependencies, risks and review points.','A current-state and future-state workflow diagram or step table.','What should happen before a workflow is automated?',['Automate every step immediately','Document and stabilise the process and its exceptions','Remove all human review','Purchase an AI API'],1,'Process understanding and exception handling are prerequisites for reliable automation.',['Workflow design','Responsible AI'],'https://www.nist.gov/itl/ai-risk-management-framework'),
            L('ai-automation-design','Design automation with controls','Build validation, logging, retries and human approval into a workflow.','A dependable workflow validates inputs, handles expected errors, records key events and defines a safe failure path. Keep human approval for consequential decisions and irreversible actions.','A script that updates a report should check that the source date is current and row counts are plausible before overwriting the previous version.','Specify three input checks, two exception paths and one approval checkpoint for a workflow you mapped.','An automation specification with control points and acceptance tests.','What is the best response when a critical validation fails?',['Publish anyway','Silently replace missing data','Stop or quarantine the run and alert a reviewer','Hide the error log'],2,'A failed critical control should prevent unsafe downstream use and make the problem visible.',['Workflow design','Responsible AI'],'https://www.nist.gov/itl/ai-risk-management-framework')
          ]),
          M('ai-auto2','Python automation and operational quality',['Understand a small data-processing script.','Apply responsible handling and quality monitoring.'],[
            L('ai-python-pipeline','Understand a repeatable Python data workflow','Describe a pipeline that reads, validates, transforms and exports data.','A simple data pipeline separates ingestion, validation, transformation and output. Use clear functions, configuration for variable inputs and explicit error messages. Test with a small sample before processing a full dataset.','Read a CSV, check required columns, parse dates, remove exact duplicates and export a cleaned copy while preserving the original file.','Write pseudocode for a CSV quality-check pipeline. Identify required columns, null rules, duplicate keys and output location.','A pipeline outline with inputs, validation, transformations and outputs.','Why preserve the raw input file?',['To increase the file size','To make changes auditable and allow recovery','To hide transformations','To avoid validation'],1,'Keeping raw inputs supports traceability, reproducibility and safe recovery from incorrect transformations.',['Python automation','Data quality'],'https://docs.python.org/3/tutorial/'),
            L('ai-responsible','Apply privacy and responsible-AI controls','Identify data sensitivity, human oversight and model risk.','Use data minimisation, access controls and approved tools. Do not paste confidential or personal data into an unapproved service. Document intended use, excluded uses, review requirements and escalation routes.','A public-data summary can be prepared with an external AI tool more safely than a payroll or customer record containing personal information.','Classify data used in a proposed workflow and define what can be sent to an AI service, what must be removed and who reviews the output.','A responsible-use checklist and a short risk register.','Which practice best reduces unnecessary privacy exposure?',['Send the full dataset for context','Use only the minimum approved data needed for the task','Store credentials in a prompt','Disable audit logs'],1,'Data minimisation reduces exposure while preserving the ability to complete the task.',['Responsible AI','AI evaluation'],'https://www.nist.gov/itl/ai-risk-management-framework')
          ])
        ])
      ],
      resources:[
        ['OpenAI platform guides','https://platform.openai.com/docs/guides'],
        ['NIST AI Risk Management Framework','https://www.nist.gov/itl/ai-risk-management-framework'],
        ['Python official tutorial','https://docs.python.org/3/tutorial/'],
        ['OWASP Top 10 for LLM Applications','https://owasp.org/www-project-top-10-for-large-language-model-applications/']
      ],
      capstone:'Design and evaluate an AI-assisted research or reporting workflow. Submit the process map, prompt specification, test set, rubric, results, limitations and human review controls.'
    }
  },
  {
    id:'econ',name:'Economics & Quantitative Research',short:'Economics & Research',
    summary:'Use mathematical reasoning, statistics and empirical methods to answer economic and policy questions.',
    audience:'Economics students, analysts and researchers strengthening quantitative and evidence-based reasoning.',
    programme:{id:'economics-quant',title:'Economics & Quantitative Research Programme',level:'Foundation to applied',hours:60,
      entry:'Basic algebra is helpful. Mathematical and statistical foundations are included before econometric applications.',
      outcomes:['Translate economic questions into measurable variables.','Use descriptive statistics and probability to analyse uncertainty.','Understand sampling, inference and hypothesis testing.','Interpret regression output and common model limitations.','Develop a source-traceable economic or policy research brief.'],
      competencies:['Mathematical reasoning','Probability and statistics','Research design','Econometrics','Economic data analysis','Forecasting','Policy communication'],
      courses:[
        C('qr-foundations','Statistics and Research Design','Build the mathematical and statistical foundations of empirical analysis.',[],[
          M('qr-m1','Descriptive statistics and probability',['Summarise distributions and variation.','Interpret probability and uncertainty.'],[
            L('qr-descriptive','Describe distributions and variation','Use location, spread and shape to understand a dataset.','Begin with the data-generating context. Use counts, mean, median, quantiles, standard deviation and visual inspection. Averages alone can obscure skewness, outliers and subgroup differences.','Two regions may have the same mean household income but different inequality and median income. The distribution matters for policy interpretation.','Describe one numeric variable using centre, spread, shape and outlier checks. State the unit and sample size.','A one-page descriptive statistics profile with interpretation.','Which statistic is most directly associated with dispersion around the mean?',['Median','Standard deviation','Mode','Sample size'],1,'Standard deviation measures the typical squared-deviation-based spread around the mean, in the same units after taking the square root.',['Mathematical reasoning','Probability and statistics'],'https://www.itl.nist.gov/div898/handbook/'),
            L('qr-probability','Reason with probability and risk','Interpret events, conditional probability and expected values.','Probability quantifies uncertainty under a defined model or reference class. Conditional probability changes the relevant information set. Expected value is a weighted average, not a guarantee of the outcome.','A 20% chance of a loss of ₦100,000 has an expected loss of ₦20,000, but the realised loss is not necessarily ₦20,000.','Define an event, its complement and a conditional probability for a practical risk scenario. Explain the assumptions behind the probability.','A short probability tree or calculation with assumptions.','What does an expected value represent?',['The outcome that must occur','A probability-weighted average across possible outcomes','The most recent observation','A guaranteed minimum'],1,'Expected value is a long-run probability-weighted average under the stated model, not a promise about one outcome.',['Probability and statistics','Mathematical reasoning'],'https://www.openintro.org/book/os/'),
          ]),
          M('qr-m2','Sampling and statistical inference',['Explain sampling variation and uncertainty.','Interpret confidence intervals and tests cautiously.'],[
            L('qr-sampling','Understand samples and sampling bias','Distinguish a sample estimate from the population quantity.','Sampling variability arises because different samples produce different estimates. Selection bias occurs when inclusion is related to the outcome or key characteristics. Increasing sample size does not repair a systematically biased design.','A web survey about internet access may under-represent people with limited connectivity, even if thousands respond.','Identify target population, sampling frame, selection process and likely non-response bias in a survey scenario.','A short research design critique with likely sources of bias.','Which problem is not solved simply by increasing sample size?',['Random sampling variation','Systematic selection bias','A wider standard error','A smaller sample'],1,'A large biased sample can still produce a systematically misleading estimate.',['Research design','Probability and statistics'],'https://www.openintro.org/book/os/'),
            L('qr-inference','Interpret confidence intervals and hypothesis tests','Explain uncertainty, null hypotheses, p-values and practical significance.','A confidence interval describes estimation uncertainty under a sampling model. A p-value is the probability of data at least as extreme as observed under the null model, not the probability that the null is true. Statistical significance is not the same as policy importance.','A small estimated effect may be statistically significant in a large sample but too small to matter operationally.','Interpret a hypothetical coefficient and confidence interval. State the direction, uncertainty and practical meaning without claiming causation.','A plain-language inference statement with estimate, interval and caveat.','A p-value is best interpreted as:',['The probability that the null hypothesis is true','The probability of data at least as extreme under the null model','The size of the treatment effect','The probability the sample is representative'],1,'The p-value is defined relative to the null model and the observed test statistic.',['Probability and statistics','Research design'],'https://www.itl.nist.gov/div898/handbook/')
          ])
        ]),
        C('qr-applied','Econometrics and Economic Intelligence','Interpret empirical models, build evidence from public economic data and communicate uncertainty.',['qr-foundations'],[
          M('qr-m3','Regression and empirical interpretation',['Understand regression coefficients and model assumptions.','Separate association from causal effect.'],[
            L('qr-regression','Understand linear regression and assumptions','Explain outcome, predictors, coefficient meaning and residuals.','Regression models conditional relationships between an outcome and explanatory variables. Interpretation depends on specification, measurement, functional form, sampling and assumptions. A coefficient is not automatically a causal effect.','In a model of wages and education, the education coefficient may reflect both education and unobserved differences if relevant confounders are omitted.','Write a regression equation for an economic question. Define each variable, unit and expected sign, then list plausible confounders.','A model specification note with assumptions and identification concerns.','What does an ordinary least squares coefficient represent in a simple model?',['A guaranteed causal effect','The fitted change in the outcome associated with a one-unit predictor change','The model R-squared','The sample mean'],1,'It describes the fitted conditional association, subject to model specification and assumptions.',['Econometrics','Research design'],'https://www.statsmodels.org/stable/index.html'),
            L('qr-interpret','Interpret model output and diagnostics','Read coefficients, standard errors, fit measures and residual diagnostics.','Review coefficient units, confidence intervals, sample size, fit statistics and diagnostics. Check residual patterns, influential observations, multicollinearity and heteroskedasticity where relevant. Report sensitivity and limitations rather than only headline fit.','A coefficient of 0.4 in a log-level model has a different interpretation from a 0.4 coefficient in a level-level model. Units and transformations matter.','Interpret a small regression output table. Identify one meaningful coefficient, one diagnostic concern and one robustness check.','A model interpretation sheet that includes units, uncertainty and diagnostics.','Why should analysts inspect residuals?',['To increase R-squared by definition','To detect patterns that indicate model misspecification or assumption problems','To remove the need for theory','To prove causality'],1,'Residual diagnostics can reveal unmodelled structure and violations that undermine interpretation.',['Econometrics','Mathematical reasoning'],'https://www.statsmodels.org/stable/diagnostic.html')
          ]),
          M('qr-m4','Economic data, forecasting and policy',['Source and compare economic indicators responsibly.','Build and communicate a simple forecast or policy scenario.'],[
            L('qr-indicators','Work with economic indicators and metadata','Use definitions, units, periodicity and provenance when comparing indicators.','Economic series differ in coverage, update schedule, base year, currency, price basis and revision policy. Record indicator codes, source, observation period and retrieval date. Avoid comparing incompatible measures.','Nominal GDP growth and real GDP growth answer different questions because one includes price changes and the other is adjusted for them.','Choose two macroeconomic indicators from a reputable source. Document their definition, unit, frequency, period and limitations.','A source log and an indicator comparison chart.','Why must the indicator definition and unit be checked before comparing two series?',['Because chart colours may differ','Because measures may represent different concepts or price bases','Because every source uses the same method','Because metadata is only decorative'],1,'Comparability depends on definitions, units, base periods, frequency and coverage.',['Economic data analysis','Policy communication'],'https://data.worldbank.org/'),
            L('qr-forecast','Build a baseline forecast and scenario','Create a simple baseline, compare assumptions and communicate forecast uncertainty.','A forecast extrapolates patterns under assumptions; it is not a statement of certainty. Start with a transparent baseline, assess historical errors and compare plausible scenarios. Avoid fitting complexity unsupported by the available history.','A moving average can provide a transparent benchmark for a stable series, but it may lag when a structural break or major policy shock occurs.','Create a naive or moving-average forecast for a monthly series. Compare it with a simple holdout baseline and state when it may fail.','A forecast table or chart with baseline, assumptions, error measure and limitations.','What is the main purpose of a holdout period?',['To make the training sample larger','To evaluate forecast performance on observations not used to fit the model','To eliminate structural breaks','To guarantee accurate prediction'],1,'A holdout period provides an out-of-sample check against data not used to produce the forecast.',['Forecasting','Economic data analysis'],'https://otexts.com/fpp3/')
          ])
        ])
      ],
      resources:[
        ['World Bank Open Data','https://data.worldbank.org/'],
        ['World Bank Indicators API','https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation'],
        ['Statsmodels documentation','https://www.statsmodels.org/stable/index.html'],
        ['Forecasting: Principles and Practice','https://otexts.com/fpp3/'],
        ['OpenIntro Statistics','https://www.openintro.org/book/os/']
      ],
      capstone:'Produce a source-traceable economic or policy brief using public data. Include a question, data provenance, methods, tables or charts, uncertainty, limitations and a proportionate recommendation.'
    }
  },
  {
    id:'professional',name:'Professional Development & Income Generation',short:'Professional Growth',
    summary:'Translate technical capability into clear service offers, credible project evidence and professional delivery.',
    audience:'Analysts, researchers, freelancers and independent professionals building client-ready work.',
    programme:{id:'professional-practice',title:'Professional Analytics & Independent Work Programme',level:'Applied to professional',hours:40,
      entry:'A basic skill or service area to develop is helpful. You can use work from another SkillForge programme as the basis for your portfolio.',
      outcomes:['Position services around buyer problems and measurable outputs.','Create credible project case studies and evidence portfolios.','Write proposals with defined scope, assumptions and acceptance criteria.','Research buyers, validate demand and price services transparently.','Deliver work with clear communication and repeatable quality controls.'],
      competencies:['Professional positioning','Portfolio evidence','Service design','Market research','Proposal writing','Client communication','Project delivery'],
      courses:[
        C('pro-foundations','Positioning, Portfolio and Service Design','Define a buyer, outcome, service scope and credible professional evidence.',[],[
          M('pro-m1','Position around buyer outcomes',['Identify a buyer and costly problem.','Translate tools and tasks into service outcomes.'],[
            L('pro-buyer','Identify a buyer problem and outcome','Describe a buyer, current difficulty and desired operational result.','A service offer starts with a buyer and problem, not a software list. Identify the buyer’s context, current process, cost of the problem and the outcome they can evaluate.','“I use Excel and Python” describes tools. “I reconcile monthly sales data and deliver a decision-ready KPI pack” describes an outcome.','Choose one target buyer and write the problem, consequence, desired result and evidence that would show improvement.','A buyer/problem/outcome statement.','Which positioning is more buyer-centred?',['I know Excel, Python and SQL','I build reconciled sales reports that help owners identify margin and stock issues','I am passionate about analytics','I can use many AI tools'],1,'The second statement describes the client, the deliverable and the decision value.',['Professional positioning','Service design'],'https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis'),
            L('pro-scope','Package a service with a clear scope','Define deliverables, boundaries, dependencies, timeline and acceptance criteria.','A well-scoped service states what is included, what is excluded, required client inputs, milestones, revision limits and how acceptance will be judged. Clear boundaries reduce delivery friction and prevent unpriced work expansion.','A dashboard project may include data profiling, KPI definitions, two report pages and a handover guide, but exclude ongoing data engineering and daily maintenance.','Write a one-page service specification with deliverables, exclusions, assumptions, required inputs and acceptance tests.','A service scope document.','What makes an acceptance criterion useful?',['It is vague and aspirational','It is observable and testable by both parties','It lists tools without outputs','It avoids stating exclusions'],1,'Observable acceptance criteria create a shared basis for reviewing delivery.',['Service design','Project delivery'],'https://www.gov.uk/service-manual/agile-delivery/writing-user-stories')
          ]),
          M('pro-m2','Portfolio as professional evidence',['Document method, contribution and limitations.','Build a case study that a buyer can evaluate.'],[
            L('pro-case-study','Write a project case study','Explain the context, question, approach, output and decision relevance.','A credible case study is structured around a problem and evidence. Show the data source, method, decisions, deliverable and limitations. Distinguish personal contribution from team work and synthetic demonstrations from client results.','A retail analytics case can show how data quality checks, KPI definitions and price-volume analysis lead to a diagnostic recommendation using a clearly labelled synthetic dataset.','Turn one completed exercise into a case study with context, objective, method, output, findings, caveats and next step.','A portfolio-ready case study outline with links to reproducible artifacts.','Which disclosure is important for a synthetic dataset?',['Presenting it as client data','Clearly labelling it as synthetic and method-demonstration evidence','Removing all data provenance','Claiming observed business impact'],1,'The audience must know what the evidence represents and what it does not establish.',['Portfolio evidence','Professional positioning'],'https://docs.github.com/en/repositories/working-with-files/using-files/README'),
            L('pro-evidence-audit','Audit the strength of your portfolio evidence','Separate skill claims, work samples, observed outcomes and unsupported claims.','Evidence can include reproducible code, documented analysis, dashboards, presentations and independent feedback. State scope and limitations. Do not imply employment, certification, client impact or external validation without proof.','A public-data brief demonstrates sourcing and analysis. It does not establish that a client adopted the recommendation or that a business gained revenue.','Review three portfolio claims and label each as demonstrated artifact, self-reported experience, measured impact or unsupported assertion. Rewrite weak claims.','An evidence audit and a prioritised portfolio improvement list.','What can a public-data project legitimately demonstrate?',['A guaranteed job outcome','The method and analytical artifact created from the stated public data','A client revenue increase without evidence','Professional certification'],1,'A clearly documented public-data project can show method and output, but not unsupported employment or commercial impact.',['Portfolio evidence','Professional positioning'],'https://docs.github.com/en/repositories/working-with-files/using-files/README')
          ])
        ]),
        C('pro-client','Client Acquisition and Consulting Delivery','Validate a narrow offer, write proposals and deliver work through a professional operating process.',['pro-foundations'],[
          M('pro-m3','Market research, proposals and pricing',['Research a buyer segment and validate demand.','Write a proposal around deliverables and value.'],[
            L('pro-market','Research a market and validate demand','Collect evidence about buyer needs, existing solutions and willingness to engage.','Demand validation combines observable signals: job descriptions, procurement notices, public requests, competitor offers, buyer interviews and response patterns. Interest is not the same as a confirmed purchase.','Repeated requests for monthly KPI reporting in a sector may indicate a recurring problem, but the buyer, budget and buying process still need validation.','Build a small demand evidence table with buyer segment, problem signal, existing alternative, source and confidence.','A one-page market validation note with evidence and unanswered questions.','Which is stronger evidence of demand than general social-media engagement?',['A buyer asking for a scoped proposal','A high follower count','A generic compliment','A large market-size estimate alone'],0,'A request for a scoped proposal is a direct signal of buyer intent, though it does not guarantee a sale.',['Market research','Professional positioning'],'https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis'),
            L('pro-proposal','Write a proposal with a defensible price','Connect scope, effort, risk, assumptions and price.','A proposal should summarise the buyer problem, proposed method, deliverables, timeline, assumptions, exclusions, review process and commercial terms. Estimate effort and risk transparently; avoid arbitrary low pricing that makes delivery unsustainable.','A fixed-fee analysis should state expected data volume, number of revisions, client dependencies and what happens when source data is unusable.','Draft a proposal outline and estimate the hours for discovery, analysis, QA, reporting and handover. Add a contingency for uncertainty.','A proposal and pricing worksheet with assumptions.','A defensible project price should be based primarily on:',['Competitor price copied without context','Scope, effort, value, risk and delivery costs','The lowest amount the buyer mentions','The number of tools used'],1,'A defensible price accounts for the work, value, costs, risk and specific scope agreed with the buyer.',['Proposal writing','Service design'],'https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs')
          ]),
          M('pro-m4','Client communication and delivery operations',['Manage milestones, reviews and change requests.','Build repeatable delivery and follow-up practices.'],[
            L('pro-communication','Communicate progress and manage changes','Set expectations through concise updates, documented decisions and escalation.','Good delivery communication makes status, blockers, decisions and next actions visible. When a new request changes scope, explain the effect on timeline, cost and acceptance criteria before proceeding.','A weekly update can include completed work, evidence checked, open blocker, decision required and the next milestone.','Write a client status update for a project delayed by missing data. Include impact, mitigation and the decision needed.','A reusable client update and change-control template.','What should happen when a client adds a material new deliverable?',['Accept silently','Agree a scope, timeline and price change before doing it','Remove quality checks','Hide the added work'],1,'Scope changes should be documented and agreed before additional work begins.',['Client communication','Project delivery'],'https://www.pmi.org/learning/library'),
            L('pro-repeatable','Design a reliable delivery and repeat-work system','Use checklists, quality gates and post-project review to improve delivery.','A repeatable service includes intake, source checks, version control, analysis, QA, handover and close-out. Recurring services require a defined cadence, change log and explicit service boundaries.','A monthly reporting service can standardise source refresh checks, KPI reconciliation, review sign-off and a handover note while retaining space for exceptions.','Design a service delivery checklist and a post-project review with quality, communication, effort variance and client feedback.','A delivery SOP and a service improvement log.','Why should a recurring service define its cadence and boundaries?',['To make all months identical regardless of data','To clarify expected work, service levels and change handling','To eliminate client review','To guarantee renewal'],1,'Clear cadence and scope make recurring work predictable while preserving explicit change control.',['Project delivery','Client communication'],'https://www.pmi.org/learning/library')
          ])
        ])
      ],
      resources:[
        ['SBA market research guide','https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis'],
        ['GitHub repository documentation','https://docs.github.com/en/repositories'],
        ['PMI learning resources','https://www.pmi.org/learning/library'],
        ['UK Service Manual: user stories','https://www.gov.uk/service-manual/agile-delivery/writing-user-stories']
      ],
      capstone:'Create a buyer-centred service offer and a complete case study. Submit the problem statement, scope, work sample, proposal, price assumptions, delivery checklist and a plan for validating demand.'
    }
  }
];

const projects = [
  {id:'project-foundation',level:'Level 1 · Foundation',school:'data',title:'Spreadsheet KPI and data-quality audit',
   problem:'A small organisation receives a monthly CSV export but its leadership cannot explain the movement in sales and margin.',
   context:'Use a public or synthetic transaction dataset. Preserve the raw file and document every transformation.',
   skills:['Data quality','Spreadsheet modelling','Problem framing'],
   resources:[['World Bank sample indicators','https://data.worldbank.org/'],['Our World in Data datasets','https://ourworldindata.org/']],
   deliverables:['Problem statement and metric dictionary','Data-quality log with missingness and duplicate checks','Three descriptive KPIs and one clear chart','A 150-word interpretation with limitations'],
   rubric:['Question, audience and period are explicit','Metric definitions and units are reproducible','Cleaning and calculations are checked','Findings are separated from assumptions']},
  {id:'project-applied',level:'Level 2 · Applied',school:'ai',title:'AI-assisted research workflow evaluation',
   problem:'A research team wants to accelerate recurring market or policy briefs but needs evidence that the workflow is reliable.',
   context:'Use non-sensitive public questions. Compare AI-assisted outputs with authoritative source material and record failures.',
   skills:['Prompt design','Source verification','AI evaluation','Responsible AI'],
   resources:[['NIST AI Risk Management Framework','https://www.nist.gov/itl/ai-risk-management-framework'],['OpenAI platform guides','https://platform.openai.com/docs/guides']],
   deliverables:['Workflow map and structured prompt','At least five test cases with reference evidence','Quality rubric and scored results','Failure analysis, privacy rules and human-review controls'],
   rubric:['Test cases represent varied query types','Sources support the exact claims','Scoring criteria are defined before evaluation','Limitations and escalation controls are documented']},
  {id:'project-professional',level:'Level 3 · Professional',school:'econ',title:'Nigeria economic indicator brief',
   problem:'A policy or business audience needs a concise interpretation of a selected Nigerian economic indicator and its implications.',
   context:'Use official public data. Record the series code, definition, period, frequency, unit and retrieval date. Do not combine incompatible series.',
   skills:['Economic data analysis','Research design','Forecasting','Policy communication'],
   resources:[['World Bank Open Data','https://data.worldbank.org/'],['World Bank Indicators API','https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation']],
   deliverables:['Research question and source log','Indicator trend chart with metadata','Comparison or scenario analysis','Two-page brief with limitations and recommendations'],
   rubric:['Primary-source data provenance is clear','Definitions and periods are comparable','Methods and uncertainty are explained','Recommendation follows from presented evidence']},
  {id:'project-capstone',level:'Level 4 · Capstone',school:'professional',title:'Client-ready decision analytics case study',
   problem:'A defined buyer needs to make a decision using incomplete or messy operational information.',
   context:'Choose a buyer and decision. Build on a previous project or an appropriate public/synthetic dataset. Label the evidence type honestly.',
   skills:['Professional positioning','Portfolio evidence','Service design','Decision communication','Project delivery'],
   resources:[['GitHub documentation','https://docs.github.com/en/repositories'],['SBA market research guide','https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis']],
   deliverables:['Buyer problem statement and scoped brief','Reproducible analysis or model with QA','Executive presentation or written decision memo','Published portfolio artifact and retrospective'],
   rubric:['The buyer problem and scope are explicit','Methods, assumptions and quality checks are reproducible','The deliverable is clear and decision-useful','Limitations, contribution and next steps are disclosed']}
];

let state = loadState();
let ui = {tab:'explore',program:null,course:null,lesson:null};
let csvReport = null;

function emptyState(){return {version:1,enrolledPrograms:[],completedLessons:[],lessonAttempts:{},courseAssessments:{},assessmentDrafts:{},projects:{},createdAt:new Date().toISOString(),updatedAt:null};}
function loadState(){
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if(raw && raw.version===1){
      const fresh=emptyState();
      return Object.assign(fresh,raw,{
        enrolledPrograms:Array.isArray(raw.enrolledPrograms)?raw.enrolledPrograms:[],
        completedLessons:Array.isArray(raw.completedLessons)?raw.completedLessons:[],
        lessonAttempts:raw.lessonAttempts&&typeof raw.lessonAttempts==='object'?raw.lessonAttempts:{},
        courseAssessments:raw.courseAssessments&&typeof raw.courseAssessments==='object'?raw.courseAssessments:{},
        assessmentDrafts:raw.assessmentDrafts&&typeof raw.assessmentDrafts==='object'?raw.assessmentDrafts:{},
        projects:raw.projects&&typeof raw.projects==='object'?raw.projects:{}
      });
    }
  } catch(e) {}
  return emptyState();
}
function persist(){
  state.updatedAt=new Date().toISOString();
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); updateHomeSummary(); return true; }
  catch(e){notify('Browser storage is unavailable or full. Export your record before clearing browser data.');return false;}
}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function notify(message){
  let el=document.getElementById('toast');
  if(el){el.textContent=message;el.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(function(){el.classList.remove('show');},2600);}
  else { console.info(message); }
}
function allCourses(){return schools.reduce(function(a,s){return a.concat(s.programme.courses);},[]);}
function allLessons(){return schools.reduce(function(a,s){return a.concat(s.programme.courses.reduce(function(b,c){return b.concat(c.modules.reduce(function(d,m){return d.concat(m.lessons);},[]));},[]));},[]);}
function findProgram(id){return schools.map(function(s){return s.programme;}).find(function(p){return p.id===id;})||null;}
function findSchoolForProgram(id){return schools.find(function(s){return s.programme.id===id;})||null;}
function findCourse(id){return allCourses().find(function(c){return c.id===id;})||null;}
function findLesson(id){return allLessons().find(function(l){return l.id===id;})||null;}
function programForCourse(courseId){const school=schools.find(function(s){return s.programme.courses.some(function(c){return c.id===courseId;});});return school?school.programme:null;}
function lessonsForCourse(course){return course.modules.reduce(function(a,m){return a.concat(m.lessons);},[]);}
function courseLessonsDone(course){return lessonsForCourse(course).filter(function(l){return state.completedLessons.includes(l.id);}).length;}
function courseAssessmentPassed(course){return !!(state.courseAssessments[course.id]&&state.courseAssessments[course.id].passed);}
function courseComplete(course){return courseLessonsDone(course)===lessonsForCourse(course).length&&courseAssessmentPassed(course);}
function courseUnlocked(course){return (course.prerequisites||[]).every(function(id){const p=findCourse(id);return p&&courseComplete(p);});}
function coursePercent(course){const total=lessonsForCourse(course).length;const done=courseLessonsDone(course);const assessment=courseAssessmentPassed(course)?1:0;return Math.round((total?done/total:0)*80+assessment*20);}
function programmePercent(program){const courses=program.courses;return Math.round(courses.reduce(function(a,c){return a+coursePercent(c);},0)/(courses.length||1));}
function enrollmentCount(){return state.enrolledPrograms.length;}
function completedCount(){return state.completedLessons.length;}
function competencyData(){
  const names={};
  allLessons().forEach(function(l){(l.skills||[]).forEach(function(skill){if(!names[skill])names[skill]={practice:0,lessons:0,applied:false};names[skill].lessons++;if(state.completedLessons.includes(l.id))names[skill].practice++;});});
  projects.forEach(function(p){const e=state.projects[p.id];if(e&&e.saved){(p.skills||[]).forEach(function(skill){if(!names[skill])names[skill]={practice:0,lessons:0,applied:false};names[skill].applied=true;});}});
  return Object.keys(names).sort().map(function(name){const d=names[name];return {name:name,practice:d.practice,lessons:d.lessons,applied:d.applied,status:d.applied?'Applied project evidence':d.practice?'Learning practice evidence':'Not yet evidenced'};});
}
function recommendedNext(){
  for(let i=0;i<schools.length;i++){
    const p=schools[i].programme;
    if(!state.enrolledPrograms.includes(p.id))continue;
    for(let j=0;j<p.courses.length;j++){
      const c=p.courses[j];
      if(!courseUnlocked(c)||courseComplete(c))continue;
      const next=lessonsForCourse(c).find(function(l){return !state.completedLessons.includes(l.id);});
      if(next)return {type:'lesson',program:p,course:c,lesson:next};
      if(!courseAssessmentPassed(c))return {type:'assessment',program:p,course:c};
    }
  }
  const enrolled=schools.find(function(s){return state.enrolledPrograms.includes(s.programme.id);});
  if(enrolled){
    const complete=schools.find(function(s){return state.enrolledPrograms.includes(s.programme.id)&&s.programme.courses.every(courseComplete);});
    if(complete)return {type:'capstone',program:complete.programme};
  }
  return null;
}
function progressSummary(){
  const all=allLessons();
  const done=all.filter(function(l){return state.completedLessons.includes(l.id);}).length;
  const attempts=Object.keys(state.lessonAttempts);
  const correct=attempts.filter(function(id){return state.lessonAttempts[id]&&state.lessonAttempts[id].correct;}).length;
  const programmes=schools.map(function(s){return s.programme;});
  const passed=allCourses().filter(courseComplete).length;
  const savedProjects=projects.filter(function(p){return state.projects[p.id]&&state.projects[p.id].saved;}).length;
  return {done:done,total:all.length,attempts:attempts.length,correct:correct,accuracy:attempts.length?Math.round(correct/attempts.length*100):0,enrolled:enrollmentCount(),coursesPassed:passed,coursesTotal:allCourses().length,projects:savedProjects,programmes:programmes.length};
}
function insertStyles(){
  if(document.getElementById('sf-academy-styles'))return;
  const style=document.createElement('style');
  style.id='sf-academy-styles';
  style.textContent=
  '.sf-academy-nav{margin-top:4px}.sf-academy-nav .ico{font-size:15px}.sf-academy-head{display:flex;justify-content:space-between;gap:16px;align-items:center;margin:4px 0 18px}.sf-academy-head h1{font-size:clamp(26px,3vw,34px);letter-spacing:-1.1px;margin:5px 0}.sf-academy-head p{font-size:12px;line-height:1.7;color:var(--muted);max-width:740px;margin:0}.sf-academy-stamp{white-space:nowrap;border:1px solid var(--line);border-radius:20px;padding:8px 11px;background:#fff;color:#4d5c74;font-size:10px;font-weight:800}.sf-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:18px 0 17px;border-bottom:1px solid var(--line);padding-bottom:10px}.sf-tab{background:#fff;border:1px solid var(--line);border-radius:9px;padding:9px 12px;color:#55627a;font-size:11px;font-weight:850}.sf-tab.active{background:var(--navy);color:#fff;border-color:var(--navy)}.sf-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:16px 0}.sf-kpi{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px}.sf-kpi strong{display:block;font-size:24px;letter-spacing:-.8px}.sf-kpi span{font-size:10px;color:var(--muted)}.sf-school-grid,.sf-program-grid,.sf-course-grid,.sf-project-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.sf-card{background:#fff;border:1px solid var(--line);border-radius:15px;padding:18px;min-width:0}.sf-card h3{font-size:15px;line-height:1.35;margin:7px 0}.sf-card p{font-size:11px;line-height:1.8;color:var(--muted);margin:5px 0 12px}.sf-school-mark{display:inline-flex;border-radius:8px;padding:6px 9px;background:#edf1ff;color:#3953c4;font-size:9px;font-weight:900;letter-spacing:.4px}.sf-meta{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.sf-pill{background:#f1f4f9;border-radius:20px;padding:5px 8px;font-size:9px;color:#5f6c82;font-weight:800}.sf-card-foot{display:flex;justify-content:space-between;align-items:center;gap:9px;margin-top:14px}.sf-progress{height:7px;background:#edf0f6;border-radius:10px;overflow:hidden;margin:8px 0}.sf-progress span{display:block;height:100%;background:var(--brand-gradient);border-radius:10px}.sf-muted{font-size:10px;color:var(--muted)}.sf-back{border:0;background:none;color:var(--blue);font-size:11px;font-weight:850;padding:0;margin:0 0 10px}.sf-detail-head{background:var(--navy);color:white;border-radius:17px;padding:23px;margin:8px 0 15px}.sf-detail-head h2{font-size:25px;letter-spacing:-.8px;margin:8px 0}.sf-detail-head p{font-size:11px;color:#c1cad9;line-height:1.8;max-width:850px}.sf-detail-head .sf-pill{background:#ffffff18;color:#e1e9f5}.sf-outcomes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0}.sf-outcome{border:1px solid #e6eaf3;border-radius:9px;padding:10px;background:#fafbfe;font-size:10px;line-height:1.6;color:#45536b}.sf-course-card{display:flex;flex-direction:column;gap:8px}.sf-course-card .sf-card-foot{margin-top:auto}.sf-module{background:#fff;border:1px solid var(--line);border-radius:13px;margin:11px 0;overflow:hidden}.sf-module-head{padding:13px 15px;background:#f7f8fc;display:flex;justify-content:space-between;gap:12px;align-items:center}.sf-module-head h3{margin:0;font-size:13px}.sf-module-head p{font-size:10px;margin:4px 0 0;color:var(--muted)}.sf-lesson-row{display:flex;align-items:center;gap:10px;border-top:1px solid #eef1f6;padding:11px 14px}.sf-lesson-row .sf-lesson-copy{flex:1;min-width:0}.sf-lesson-row b{display:block;font-size:11px}.sf-lesson-row small{font-size:9px;color:var(--muted)}.sf-checkmark{width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:#f0f3f8;color:#738098;font-size:10px;font-weight:900;flex:0 0 23px}.sf-checkmark.done{background:#e6ebff;color:#4455c8}.sf-lesson-body{background:#fff;border:1px solid var(--line);border-radius:15px;padding:22px;margin:12px 0}.sf-lesson-body h2{font-size:16px;margin:20px 0 7px}.sf-lesson-body p,.sf-lesson-body li{font-size:12px;line-height:1.9;color:#47546b}.sf-lesson-body ul{padding-left:21px}.sf-example{background:#f1f7ff;border-left:3px solid var(--cyan);border-radius:0 9px 9px 0;padding:13px 15px;font-size:11px;line-height:1.8;color:#33425c;margin:12px 0}.sf-quiz{background:#f7f8fc;border:1px solid var(--line);border-radius:13px;padding:17px;margin-top:15px}.sf-quiz h3{font-size:13px;margin:0 0 10px}.sf-option{display:block;width:100%;text-align:left;background:#fff;border:1px solid var(--line);border-radius:9px;padding:10px 12px;margin:7px 0;font-size:11px;color:var(--ink)}.sf-option.selected{border-color:var(--blue);background:#f1f5ff}.sf-feedback{margin-top:10px;border-radius:9px;padding:11px 12px;font-size:11px;line-height:1.7}.sf-feedback.good{background:#eaf7ef;color:#175d36}.sf-feedback.bad{background:#fff3ea;color:#914b1c}.sf-rubric{display:grid;gap:7px;margin:13px 0}.sf-rubric label{font-size:10px;line-height:1.5;display:flex;gap:8px;align-items:flex-start;color:#4d5c72}.sf-rubric input{margin-top:2px;accent-color:#4d4bc6}.sf-panel{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px;margin:12px 0}.sf-panel h3{font-size:14px;margin:0 0 8px}.sf-panel p{font-size:11px;line-height:1.75;color:var(--muted)}.sf-grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.sf-field{display:grid;gap:5px;margin:8px 0}.sf-field label{font-size:10px;font-weight:850;color:#4d5a71}.sf-field input,.sf-field textarea,.sf-field select{width:100%;border:1px solid var(--line);border-radius:9px;padding:10px 11px;background:#fff;font-size:11px;color:var(--ink);min-width:0}.sf-field textarea{min-height:92px;resize:vertical;line-height:1.6}.sf-result{padding:12px;border-radius:10px;background:#f1f5ff;border:1px solid #e2e9ff;font-size:11px;line-height:1.7;color:#334c9a;margin-top:10px}.sf-table-wrap{overflow:auto;border:1px solid var(--line);border-radius:10px;margin-top:10px}.sf-table{border-collapse:collapse;width:100%;min-width:500px;font-size:10px}.sf-table th,.sf-table td{border-bottom:1px solid #edf0f5;padding:8px 10px;text-align:left;max-width:220px;overflow:hidden;text-overflow:ellipsis}.sf-table th{background:#f5f7fb;color:#4a5972}.sf-progress-list{display:grid;gap:12px}.sf-progress-row{display:grid;grid-template-columns:minmax(120px,1fr) minmax(90px,2fr) 36px;gap:10px;align-items:center;font-size:10px}.sf-evidence{border:1px solid var(--line);border-radius:11px;padding:13px;margin:10px 0}.sf-evidence h4{font-size:12px;margin:0 0 6px}.sf-note{background:#f5f2ff;border:1px solid #e2dafe;color:#59478a;border-radius:10px;padding:11px 13px;font-size:10px;line-height:1.7;margin:12px 0}.sf-empty{padding:24px;border:1px dashed #cbd4e2;border-radius:12px;text-align:center;background:#fff;color:var(--muted);font-size:11px}.sf-tag{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.7px;color:var(--blue)}.sf-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.sf-course-lock{opacity:.75}.sf-smalllink{font-size:10px;color:var(--blue);font-weight:800}.sf-home-summary{margin:15px 0;background:#fff;border:1px solid var(--line);border-radius:14px;padding:17px}.sf-home-summary h3{margin:0 0 4px;font-size:14px}.sf-home-summary p{font-size:10px;color:var(--muted);margin:0}.sf-home-summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.sf-home-summary-grid div{background:#f6f7fb;border-radius:9px;padding:10px}.sf-home-summary-grid strong{display:block;font-size:18px}.sf-home-summary-grid small{font-size:9px;color:var(--muted)}.sf-hidden{display:none!important}.sf-focus{background:#f7f9ff;border:1px solid #e1e8fb;border-radius:12px;padding:13px;margin-top:12px}.sf-assessment-result{padding:12px;background:#eef8f2;color:#21613d;border-radius:10px;font-size:11px;line-height:1.7}.sf-csv-label{display:inline-flex;gap:8px;align-items:center;border:1px dashed #b9c7dd;border-radius:10px;padding:11px 13px;background:#fafcff;font-size:11px;font-weight:800;cursor:pointer}.sf-csv-label input{max-width:190px;font-size:10px}.sf-resources{display:flex;flex-wrap:wrap;gap:8px}.sf-resources a{font-size:10px;font-weight:800;color:var(--blue);text-decoration:none;border:1px solid #e2e8f4;border-radius:20px;padding:6px 9px}.sf-resources a:hover{text-decoration:underline}.sf-muted-small{font-size:9px;color:var(--muted)}@media(max-width:820px){.sf-academy-head{align-items:flex-start;flex-direction:column}.sf-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.sf-school-grid,.sf-program-grid,.sf-course-grid,.sf-project-grid,.sf-grid-2,.sf-outcomes{grid-template-columns:1fr}.sf-home-summary-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.sf-lesson-body{padding:16px}.sf-progress-row{grid-template-columns:100px minmax(70px,1fr) 28px}.sf-card{padding:15px}}@media(max-width:420px){.sf-home-summary-grid{grid-template-columns:1fr}.sf-progress-row{grid-template-columns:1fr 1fr 28px}}';
  document.head.appendChild(style);
}
function setupView(){
  if(document.getElementById('view-academy'))return;
  const nav=document.querySelector('.sidebar .navlist');
  const paths=nav&&nav.querySelector('[data-view="paths"]');
  if(paths){
    const button=document.createElement('button');
    button.type='button';button.className='navitem sf-academy-nav';button.dataset.view='academy';
    button.innerHTML='<span class="ico">▤</span> Academy';
    button.addEventListener('click',openAcademy);
    paths.insertAdjacentElement('afterend',button);
  }
  const mobileNav=document.querySelector('.mobile-tabs');
  if(mobileNav&&!mobileNav.querySelector('[data-view="academy"]')){
    const mobileButton=document.createElement('button');
    mobileButton.type='button';mobileButton.className='mobile-tab';mobileButton.dataset.view='academy';
    mobileButton.innerHTML='<span>▤</span><span>Academy</span>';
    mobileButton.setAttribute('aria-label','Open SkillForge Academy');
    mobileButton.addEventListener('click',openAcademy);
    mobileNav.appendChild(mobileButton);
  }
  const section=document.createElement('section');
  section.id='view-academy';section.className='view';section.setAttribute('aria-labelledby','sf-academy-title');
  section.innerHTML='<div class="sf-academy-head"><div><div class="eyebrow">Structured learning environment</div><h1 id="sf-academy-title">SkillForge Academy</h1><p>Learn in sequence, practise with feedback, apply your knowledge and keep a record of the work you can show. Every core learning activity is free.</p></div><span class="sf-academy-stamp">Free-first · Local progress · v1.0 curriculum</span></div><div class="sf-kpis" id="sf-academy-kpis"></div><div class="sf-tabs" role="tablist" aria-label="Academy sections"><button class="sf-tab active" data-tab="explore" role="tab" aria-selected="true">Explore programmes</button><button class="sf-tab" data-tab="learning" role="tab" aria-selected="false">My learning</button><button class="sf-tab" data-tab="lab" role="tab" aria-selected="false">Learning lab</button><button class="sf-tab" data-tab="portfolio" role="tab" aria-selected="false">Project portfolio</button><button class="sf-tab" data-tab="competencies" role="tab" aria-selected="false">Competencies</button></div><div id="sf-academy-root" aria-live="polite"></div>';
  const content=document.querySelector('.content');
  const footer=content&&content.querySelector('.footer');
  if(content){if(footer)content.insertBefore(section,footer);else content.appendChild(section);}
  const home=document.getElementById('view-home');
  if(home&&!home.querySelector('.sf-home-summary')){
    const summary=document.createElement('div');summary.className='sf-home-summary';summary.id='sf-home-summary';
    summary.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div><h3>SkillForge Academy</h3><p>Structured programmes and project-based learning are now available alongside the 28-day challenge.</p></div><button class="btn primary" id="sf-home-open">Explore Academy</button></div><div class="sf-home-summary-grid" id="sf-home-summary-grid"></div>';
    const stats=home.querySelector('.stats');
    if(stats)stats.insertAdjacentElement('afterend',summary);else home.appendChild(summary);
    summary.querySelector('#sf-home-open').addEventListener('click',openAcademy);
  }
  const academySection=document.getElementById('view-academy');
  academySection.addEventListener('click',function(e){
    const tab=e.target.closest('button[data-tab]');
    if(!tab||tab.closest('#sf-academy-root'))return;
    ui.tab=tab.dataset.tab;ui.program=null;ui.course=null;ui.lesson=null;ui.assessment=null;
    renderAcademy();
  });
  const root=document.getElementById('sf-academy-root');
  root.addEventListener('click',handleClick);
  root.addEventListener('input',handleInput);
  root.addEventListener('change',handleChange);
}
function openAcademy(){
  document.querySelectorAll('.view').forEach(function(v){v.classList.toggle('active',v.id==='view-academy');});
  document.querySelectorAll('[data-view]').forEach(function(b){b.classList.toggle('active',b.dataset.view==='academy');});
  const crumb=document.getElementById('crumb');if(crumb)crumb.textContent='Academy';
  const sidebar=document.getElementById('sidebar');if(sidebar)sidebar.classList.remove('open');
  renderAcademy();
}
function tabButton(name,label){return '<button class="sf-tab '+(ui.tab===name?'active':'')+'" data-tab="'+name+'" role="tab" aria-selected="'+(ui.tab===name?'true':'false')+'">'+label+'</button>';}
function updateKpis(){
  const box=document.getElementById('sf-academy-kpis');if(!box)return;
  const x=progressSummary();
  box.innerHTML='<div class="sf-kpi"><strong>'+x.enrolled+'</strong><span>Programmes enrolled</span></div><div class="sf-kpi"><strong>'+x.done+'/'+x.total+'</strong><span>Lessons completed</span></div><div class="sf-kpi"><strong>'+x.coursesPassed+'</strong><span>Courses passed</span></div><div class="sf-kpi"><strong>'+x.projects+'</strong><span>Project artifacts saved</span></div>';
}
function updateHomeSummary(){
  const grid=document.getElementById('sf-home-summary-grid');if(!grid)return;
  const x=progressSummary();
  grid.innerHTML='<div><strong>'+x.enrolled+'</strong><small>Programmes enrolled</small></div><div><strong>'+x.done+'/'+x.total+'</strong><small>Academy lessons complete</small></div><div><strong>'+x.projects+'</strong><small>Portfolio artifacts saved</small></div>';
}
function renderAcademy(){
  updateKpis();updateHomeSummary();
  document.querySelectorAll('.sf-tab').forEach(function(b){b.classList.toggle('active',b.dataset.tab===ui.tab);b.setAttribute('aria-selected',b.dataset.tab===ui.tab?'true':'false');});
  const root=document.getElementById('sf-academy-root');if(!root)return;
  if(ui.lesson){root.innerHTML=renderLessonPage();renderFooterActions();return;}
  if(ui.course){root.innerHTML=renderCoursePage();renderFooterActions();return;}
  if(ui.program){root.innerHTML=renderProgramPage();renderFooterActions();return;}
  if(ui.tab==='learning')root.innerHTML=renderLearningPage();
  else if(ui.tab==='lab'){
    root.innerHTML=renderLabPage();
    calculateKpi();calculateElasticity();calculateRate();
  }
  else if(ui.tab==='portfolio')root.innerHTML=renderPortfolioPage();
  else if(ui.tab==='competencies')root.innerHTML=renderCompetenciesPage();
  else root.innerHTML=renderExplorePage();
  renderFooterActions();
}
function renderExplorePage(){
  const cards=schools.map(function(s){
    const p=s.programme;const enrolled=state.enrolledPrograms.includes(p.id);
    return '<article class="sf-card"><span class="sf-school-mark">'+esc(s.short)+'</span><h3>'+esc(p.title)+'</h3><p>'+esc(s.summary)+'</p><div class="sf-meta"><span class="sf-pill">'+esc(p.level)+'</span><span class="sf-pill">'+p.hours+' guided learning hours</span><span class="sf-pill">'+p.courses.length+' sequenced courses</span></div><div class="sf-card-foot"><span class="sf-muted">'+(enrolled?'Enrolled · '+programmePercent(p)+'% progress':'Open-access programme')+'</span><button class="btn '+(enrolled?'outline':'primary')+'" data-open-program="'+p.id+'">'+(enrolled?'Continue':'View programme')+' →</button></div></article>';
  }).join('');
  const next=recommendedNext();
  let rec='<div class="sf-note">Start with a programme that matches your current goal. Course prerequisites are enforced within each programme; you can explore all content without paying or creating an account.</div>';
  if(next)rec='<div class="sf-panel"><div class="sf-tag">Recommended next activity</div><h3>'+esc(next.lesson?next.lesson.title:next.type==='assessment'?'Course assessment':'Capstone planning')+'</h3><p>'+(next.lesson?esc(next.course.title+' · '+next.program.title):next.type==='assessment'?'Your lesson checks are complete. Take the course assessment to unlock the next course.':'Your enrolled programme is complete. Start planning the capstone artifact.')+'</p><button class="btn primary" data-recommend-next="1">Continue learning →</button></div>';
  return '<div class="sf-tag">Four independent learning schools</div><h2 class="page-title" style="font-size:21px">Choose a structured learning path</h2><p class="sf-muted">Each programme contains courses, modules, lessons, formative knowledge checks and a final course assessment. Each ends with an applied capstone brief.</p>'+rec+'<div class="sf-program-grid">'+cards+'</div><div class="sf-note">SkillForge is an independent learning platform. Its programmes and learning records are not university qualifications, accredited certificates or guarantees of employment or income.</div>';
}
function renderProgramPage(){
  const p=findProgram(ui.program);const s=findSchoolForProgram(ui.program);if(!p||!s){ui.program=null;return renderExplorePage();}
  const enrolled=state.enrolledPrograms.includes(p.id);
  const courses=p.courses.map(function(c,i){
    const unlocked=courseUnlocked(c);const complete=courseComplete(c);const done=courseLessonsDone(c);const total=lessonsForCourse(c).length;
    return '<article class="sf-card sf-course-card '+(!unlocked?'sf-course-lock':'')+'"><div class="sf-tag">Course '+(i+1)+' · '+(complete?'Complete':unlocked?'Available':'Prerequisite required')+'</div><h3>'+esc(c.title)+'</h3><p>'+esc(c.description)+'</p><div class="sf-meta"><span class="sf-pill">'+total+' lessons</span><span class="sf-pill">'+done+' completed</span><span class="sf-pill">'+coursePercent(c)+'% course progress</span></div><div class="sf-progress"><span style="width:'+coursePercent(c)+'%"></span></div><div class="sf-card-foot"><span class="sf-muted">'+(complete?'Assessment passed':unlocked?'Self-paced':'Complete '+esc(c.prerequisites.map(function(id){const pc=findCourse(id);return pc?pc.title:id;}).join(', ')))+'</span><button class="btn '+(unlocked?'primary':'outline')+'" '+(unlocked?'data-open-course="'+c.id+'"':'disabled')+'>'+(complete?'Review course':unlocked?'Open course':'Locked')+' →</button></div></article>';
  }).join('');
  const outcomes=p.outcomes.map(function(x){return '<div class="sf-outcome">'+esc(x)+'</div>';}).join('');
  const resources=p.resources.map(function(r){return '<a href="'+esc(r[1])+'" target="_blank" rel="noopener noreferrer">'+esc(r[0])+' ↗</a>';}).join('');
  return '<button class="sf-back" data-back-explore="1">← All programmes</button><div class="sf-detail-head"><div class="sf-tag" style="color:var(--cyan)">'+esc(s.name)+'</div><h2>'+esc(p.title)+'</h2><p>'+esc(s.summary)+'</p><div class="sf-meta"><span class="sf-pill">'+esc(p.level)+'</span><span class="sf-pill">'+p.hours+' estimated hours</span><span class="sf-pill">'+p.courses.length+' courses in sequence</span></div><div class="sf-actions"><button class="btn primary" data-enrol-program="'+p.id+'">'+(enrolled?'Continue programme':'Enrol free and start')+' →</button><span class="sf-muted" style="color:#c1cad9;align-self:center">No account or payment required</span></div></div><div class="sf-grid-2"><div class="sf-panel"><h3>Target learner and entry requirements</h3><p><b>Who it is for:</b> '+esc(s.audience)+'</p><p><b>Entry requirements:</b> '+esc(p.entry)+'</p><h3 style="margin-top:15px">Learning outcomes</h3><div class="sf-outcomes">'+outcomes+'</div></div><div class="sf-panel"><h3>Competencies in this programme</h3><div class="sf-meta">'+p.competencies.map(function(c){return '<span class="sf-pill">'+esc(c)+'</span>';}).join('')+'</div><h3 style="margin-top:15px">Capstone</h3><p>'+esc(p.capstone)+'</p><h3 style="margin-top:15px">Learning resources</h3><div class="sf-resources">'+resources+'</div></div></div><h2 class="page-title" style="font-size:19px;margin-top:20px">Course sequence</h2><p class="sf-muted">Complete the first course and pass its assessment to unlock the next course.</p><div class="sf-course-grid">'+courses+'</div>';
}
function renderCoursePage(){
  const c=findCourse(ui.course);const p=programForCourse(ui.course);if(!c||!p){ui.course=null;return renderExplorePage();}
  const all=lessonsForCourse(c);const done=courseLessonsDone(c);const result=state.courseAssessments[c.id];const passed=courseAssessmentPassed(c);
  const modules=c.modules.map(function(m,i){
    const mdone=m.lessons.filter(function(l){return state.completedLessons.includes(l.id);}).length;
    return '<section class="sf-module"><div class="sf-module-head"><div><h3>Module '+(i+1)+' · '+esc(m.title)+'</h3><p>'+esc(m.outcomes.join(' '))+'</p></div><span class="sf-pill">'+mdone+'/'+m.lessons.length+' complete</span></div>'+m.lessons.map(function(l,j){
      const isDone=state.completedLessons.includes(l.id);const attempt=state.lessonAttempts[l.id];
      return '<div class="sf-lesson-row"><span class="sf-checkmark '+(isDone?'done':'')+'">'+(isDone?'✓':(i+1)+'.'+(j+1))+'</span><div class="sf-lesson-copy"><b>'+esc(l.title)+'</b><small>'+l.minutes+' min · '+esc(l.objective)+'</small></div><button class="btn outline" data-open-lesson="'+l.id+'">'+(isDone?'Review':'Study')+' →</button></div>';
    }).join('')+'</section>';
  }).join('');
  let assessment='';
  if(done===all.length){
    assessment='<div class="sf-panel"><div class="sf-tag">Summative assessment</div><h3>Course knowledge assessment</h3><p>Four items drawn from the course learning outcomes. Pass mark: '+PASS_MARK+'%. You can retry after reviewing feedback. This is a SkillForge learning assessment, not an accredited examination.</p>'+(result?'<div class="sf-assessment-result">Latest result: '+result.score+'% · '+(result.passed?'Pass':'Not yet passed')+' · '+result.correct+'/'+result.total+' correct</div>':'')+'<div class="sf-actions"><button class="btn primary" data-start-assessment="'+c.id+'">'+(result&&result.passed?'Retake assessment':'Start assessment')+' →</button></div></div>';
  } else {
    assessment='<div class="sf-note">Complete all '+all.length+' lesson knowledge checks to unlock the course assessment. Current lesson completion: '+done+'/'+all.length+'.</div>';
  }
  return '<button class="sf-back" data-back-program="'+p.id+'">← '+esc(p.title)+'</button><div class="sf-detail-head"><div class="sf-tag" style="color:var(--cyan)">Course · '+esc(p.title)+'</div><h2>'+esc(c.title)+'</h2><p>'+esc(c.description)+'</p><div class="sf-meta"><span class="sf-pill">'+all.length+' lessons</span><span class="sf-pill">'+done+' completed</span><span class="sf-pill">'+coursePercent(c)+'% course progress</span><span class="sf-pill">'+(passed?'Assessment passed':'Assessment pending')+'</span></div><div class="sf-progress"><span style="width:'+coursePercent(c)+'%"></span></div></div><h2 class="page-title" style="font-size:19px">Modules and lessons</h2>'+modules+assessment+'<div class="sf-actions"><button class="btn outline" data-tab="learning">My learning</button></div>';
}
function renderLessonPage(){
  const l=findLesson(ui.lesson);const c=ui.course&&findCourse(ui.course);const p=c&&programForCourse(c.id);
  if(!l||!c||!p){ui.lesson=null;return renderExplorePage();}
  const at=state.lessonAttempts[l.id];const done=state.completedLessons.includes(l.id);const lessons=lessonsForCourse(c);const idx=lessons.findIndex(function(x){return x.id===l.id;});
  const prev=idx>0?lessons[idx-1]:null;const next=idx<lessons.length-1?lessons[idx+1]:null;
  const options=l.check.choices.map(function(choice,i){return '<button type="button" class="sf-option '+(at&&at.selected===i?'selected':'')+'" data-lesson-answer="'+i+'">'+String.fromCharCode(65+i)+'. '+esc(choice)+'</button>';}).join('');
  const feedback=at?'<div class="sf-feedback '+(at.correct?'good':'bad')+'"><b>'+(at.correct?'Correct.':'Not correct yet.')+'</b> '+esc(l.check.explanation)+'</div>':'';
  return '<button class="sf-back" data-back-course="'+c.id+'">← '+esc(c.title)+'</button><div class="sf-tag">'+esc(p.title)+' / '+esc(c.title)+'</div><div class="sf-lesson-body"><div class="sf-meta"><span class="sf-pill">'+l.minutes+' minute lesson</span><span class="sf-pill">Understand → Observe → Practise → Apply → Demonstrate → Reflect</span><span class="sf-pill">'+(done?'Completed':'In progress')+'</span></div><h1 class="page-title" style="font-size:26px">'+esc(l.title)+'</h1><h2>Learning objective</h2><p>'+esc(l.objective)+'</p><h2>Understand</h2><p>'+esc(l.concept)+'</p><h2>Observe a worked example</h2><div class="sf-example">'+esc(l.example)+'</div><h2>Practise</h2><p>'+esc(l.practice)+'</p><h2>Apply</h2><div class="sf-example"><b>Required output:</b><br>'+esc(l.deliverable)+'</div><h2>Demonstrate · Knowledge check</h2><div class="sf-quiz"><h3>'+esc(l.check.question)+'</h3>'+options+feedback+'<div class="sf-actions"><button class="btn outline" data-retry-lesson="'+l.id+'">Try again</button>'+(at&&at.correct&&!done?'<button class="btn primary" data-complete-lesson="'+l.id+'">Mark lesson complete →</button>':'')+(done?'<span class="sf-muted">Lesson completion saved on this device.</span>':'')+'</div></div><h2>Reflect</h2><p>Write one point you can explain without notes, one uncertainty you still have, and one real situation where this concept could be applied.</p>'+(l.resource?'<p class="sf-muted">Further reading: <a href="'+esc(l.resource)+'" target="_blank" rel="noopener noreferrer">Open authoritative resource ↗</a></p>':'')+'<div class="sf-actions"><button class="btn outline" '+(prev?'data-open-lesson="'+prev.id+'"':'disabled')+'>← Previous lesson</button><button class="btn primary" '+(next?'data-open-lesson="'+next.id+'"':'data-back-course="'+c.id+'"')+'>'+(next?'Next lesson':'Back to course assessment')+' →</button></div></div>';
}
function renderLearningPage(){
  const enrolled=schools.filter(function(s){return state.enrolledPrograms.includes(s.programme.id);});
  if(!enrolled.length)return '<div class="sf-empty"><h3>No enrolled programmes yet</h3><p>Choose a school to begin. Enrollment is free and stored on this device.</p><button class="btn primary" data-tab="explore">Explore programmes</button></div>';
  return '<div class="sf-tag">Learner workspace</div><h2 class="page-title" style="font-size:21px">Your programme progress</h2>'+enrolled.map(function(s){
    const p=s.programme;return '<div class="sf-panel"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><div class="sf-tag">'+esc(s.short)+'</div><h3>'+esc(p.title)+'</h3></div><strong>'+programmePercent(p)+'%</strong></div><div class="sf-progress"><span style="width:'+programmePercent(p)+'%"></span></div><div class="sf-course-grid">'+p.courses.map(function(c,i){return '<div class="sf-evidence"><div class="sf-tag">Course '+(i+1)+'</div><h4>'+esc(c.title)+'</h4><p class="sf-muted">'+courseLessonsDone(c)+'/'+lessonsForCourse(c).length+' lessons · '+(courseAssessmentPassed(c)?'Assessment passed':'Assessment not passed')+'</p><div class="sf-progress"><span style="width:'+coursePercent(c)+'%"></span></div><button class="btn outline" '+(courseUnlocked(c)?'data-open-course="'+c.id+'"':'disabled')+'>'+(courseComplete(c)?'Review':'Continue')+' →</button></div>';}).join('')+'</div></div>';
  }).join('')+'<div class="sf-note">Completion records describe activities completed in this browser. They do not independently verify mastery or external performance.</div>';
}
function renderCompetenciesPage(){
  const items=competencyData();const x=progressSummary();
  return '<div class="sf-tag">Evidence-based progression</div><h2 class="page-title" style="font-size:21px">Competency development</h2><p class="sf-muted">SkillForge separates lesson practice from applied project evidence. These are progress indicators, not validated proficiency ratings.</p><div class="sf-panel"><h3>Assessment and practice overview</h3><div class="sf-kpis"><div class="sf-kpi"><strong>'+x.attempts+'</strong><span>Lesson knowledge-check attempts</span></div><div class="sf-kpi"><strong>'+x.accuracy+'%</strong><span>Correct latest lesson responses*</span></div><div class="sf-kpi"><strong>'+x.coursesPassed+'</strong><span>Courses passed</span></div><div class="sf-kpi"><strong>'+x.projects+'</strong><span>Project artifacts saved</span></div></div><p>*Accuracy uses the most recently stored answer per lesson, not a controlled retention test.</p></div><div class="sf-panel"><h3>Competency evidence map</h3><div class="sf-progress-list">'+items.map(function(it){return '<div class="sf-progress-row"><span>'+esc(it.name)+'</span><div><div class="sf-progress"><span style="width:'+(it.lessons?Math.round(it.practice/it.lessons*100):0)+'%"></span></div><small class="sf-muted">'+it.practice+'/'+it.lessons+' linked lessons completed</small></div><span class="sf-muted">'+(it.applied?'Applied':'Practice')+'</span></div><div class="sf-muted">'+esc(it.status)+'</div>';}).join('')+'</div></div><div class="sf-note">An applied-evidence label means a learner saved an artifact mapped to the competency. It does not mean SkillForge or an independent assessor has verified the quality of that artifact.</div>';
}
function renderLabPage(){
  return '<div class="sf-tag">Practical learning environment</div><h2 class="page-title" style="font-size:21px">Learning laboratory</h2><p class="sf-muted">Use the browser-based tools to practise analytical reasoning. Uploaded CSV files are analysed locally in this page and are not sent to a server.</p><div class="sf-grid-2"><section class="sf-panel"><h3>Data laboratory · CSV quality profiler</h3><p>Upload a non-sensitive CSV file to inspect its shape, missing cells, exact duplicate rows and likely column types. Keep sensitive records out of this browser exercise.</p><label class="sf-csv-label">Choose CSV file <input id="sf-csv-file" type="file" accept=".csv,text/csv"></label><div id="sf-csv-output" aria-live="polite"><div class="sf-muted">No file selected.</div></div></section><section class="sf-panel"><h3>Business intelligence · KPI calculator</h3><p>Calculate revenue, gross profit and period-over-period revenue change. Treat this as an arithmetic exercise; validate business definitions before reporting.</p><div class="sf-grid-2"><div class="sf-field"><label for="sf-units">Units sold</label><input id="sf-units" type="number" min="0" value="120"></div><div class="sf-field"><label for="sf-price">Average selling price</label><input id="sf-price" type="number" min="0" step="0.01" value="8500"></div><div class="sf-field"><label for="sf-cost">Unit cost</label><input id="sf-cost" type="number" min="0" step="0.01" value="5100"></div><div class="sf-field"><label for="sf-prior">Prior-period revenue</label><input id="sf-prior" type="number" min="0" step="0.01" value="900000"></div></div><div class="sf-result" id="sf-kpi-output" aria-live="polite"></div></section><section class="sf-panel"><h3>Economics laboratory · Midpoint elasticity</h3><p>Calculate a midpoint price elasticity estimate from two price-quantity observations. This is descriptive unless the research design supports a causal interpretation.</p><div class="sf-grid-2"><div class="sf-field"><label for="sf-p0">Initial price</label><input id="sf-p0" type="number" min="0" step="0.01" value="100"></div><div class="sf-field"><label for="sf-p1">New price</label><input id="sf-p1" type="number" min="0" step="0.01" value="110"></div><div class="sf-field"><label for="sf-q0">Initial quantity</label><input id="sf-q0" type="number" min="0" step="0.01" value="500"></div><div class="sf-field"><label for="sf-q1">New quantity</label><input id="sf-q1" type="number" min="0" step="0.01" value="460"></div></div><div class="sf-result" id="sf-elasticity-output" aria-live="polite"></div></section><section class="sf-panel"><h3>Professional laboratory · Rate floor</h3><p>Estimate a minimum billable hourly rate from a monthly income target, business costs and realistic billable hours. This is a planning floor, not a market price recommendation.</p><div class="sf-grid-2"><div class="sf-field"><label for="sf-target">Monthly income target</label><input id="sf-target" type="number" min="0" value="500000"></div><div class="sf-field"><label for="sf-costs">Monthly operating costs</label><input id="sf-costs" type="number" min="0" value="75000"></div><div class="sf-field"><label for="sf-hours">Billable hours per month</label><input id="sf-hours" type="number" min="1" value="60"></div></div><div class="sf-result" id="sf-rate-output" aria-live="polite"></div></section></div><section class="sf-panel"><h3>SQL reasoning challenge · No database execution</h3><p>Write a query that returns total net sales by region for 2025, excludes cancelled orders, and shows only regions with more than ₦1,000,000 in net sales. Use your own schema and state the expected output grain.</p><div class="sf-field"><label for="sf-sql-answer">Your SQL draft</label><textarea id="sf-sql-answer" placeholder="SELECT ..."></textarea></div><div class="sf-rubric"><label><input type="checkbox" id="sf-sql-where"> Filters cancelled orders before aggregation</label><label><input type="checkbox" id="sf-sql-group"> Groups at the region grain</label><label><input type="checkbox" id="sf-sql-having"> Uses HAVING for the aggregate threshold</label><label><input type="checkbox" id="sf-sql-grain"> States the source and output grain</label></div><button class="btn primary" data-save-sql="1">Save SQL practice evidence</button><span class="sf-muted" id="sf-sql-status"></span></section><div class="sf-note">This first laboratory increment includes in-browser calculators and a local CSV profiler. It does not execute SQL or Python code; a secure hosted execution environment would be a separate integration.</div>';
}
function renderPortfolioPage(){
  return '<div class="sf-tag">Applied learning outputs</div><h2 class="page-title" style="font-size:21px">Project portfolio</h2><p class="sf-muted">Build evidence progressively. Save a local reflection, public artifact link and self-review rubric for each project. Do not upload confidential client material.</p><div class="sf-project-grid">'+projects.map(function(p){
    const e=state.projects[p.id]||{};const checks=e.checked||[];
    return '<article class="sf-card"><div class="sf-tag">'+esc(p.level)+'</div><h3>'+esc(p.title)+'</h3><p><b>Problem:</b> '+esc(p.problem)+'</p><p><b>Context:</b> '+esc(p.context)+'</p><div class="sf-meta">'+p.skills.map(function(x){return '<span class="sf-pill">'+esc(x)+'</span>';}).join('')+'</div><h4 style="font-size:11px;margin:12px 0 5px">Required deliverables</h4><ul>'+p.deliverables.map(function(d){return '<li style="font-size:10px;line-height:1.6;margin:4px 0;color:#4c5a70">'+esc(d)+'</li>';}).join('')+'</ul><h4 style="font-size:11px;margin:12px 0 5px">Evaluation rubric</h4><div class="sf-rubric">'+p.rubric.map(function(r,i){return '<label><input type="checkbox" data-project-check="'+p.id+'" data-criterion="'+i+'" '+(checks.includes(i)?'checked':'')+'> '+esc(r)+'</label>';}).join('')+'</div><div class="sf-field"><label for="sf-reflection-'+p.id+'">Project summary / reflection</label><textarea id="sf-reflection-'+p.id+'" placeholder="Describe the question, method, output, finding and limitation.">'+esc(e.reflection||'')+'</textarea></div><div class="sf-field"><label for="sf-link-'+p.id+'">Public artifact link (optional)</label><input id="sf-link-'+p.id+'" type="url" placeholder="https://github.com/..." value="'+esc(e.link||'')+'"></div><div class="sf-resources">'+p.resources.map(function(r){return '<a href="'+esc(r[1])+'" target="_blank" rel="noopener noreferrer">'+esc(r[0])+' ↗</a>';}).join('')+'</div><div class="sf-card-foot"><span class="sf-muted">'+(e.saved?'Saved locally · '+checks.length+'/'+p.rubric.length+' criteria reviewed':'Not yet saved')+'</span><button class="btn primary" data-save-project="'+p.id+'">Save evidence</button></div></article>';
  }).join('')+'</div><div class="sf-note">Saving a project means the learner recorded an artifact and self-review. SkillForge does not independently grade, authenticate, peer-review or certify the submitted work.</div>';
}
function handleClick(e){
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.tab){ui.tab=b.dataset.tab;ui.program=null;ui.course=null;ui.lesson=null;renderAcademy();return;}
  if(b.dataset.openProgram){ui.program=b.dataset.openProgram;ui.course=null;ui.lesson=null;renderAcademy();return;}
  if(b.dataset.enrolProgram){const id=b.dataset.enrolProgram;if(!state.enrolledPrograms.includes(id))state.enrolledPrograms.push(id);persist();ui.program=id;ui.tab='explore';renderAcademy();notify('Programme enrolled. Your progress is saved on this device.');return;}
  if(b.dataset.openCourse){const c=findCourse(b.dataset.openCourse);if(c&&courseUnlocked(c)){ui.course=c.id;ui.lesson=null;renderAcademy();}return;}
  if(b.dataset.openLesson){ui.lesson=b.dataset.openLesson;renderAcademy();return;}
  if(b.dataset.backExplore){ui.program=null;ui.course=null;ui.lesson=null;ui.tab='explore';renderAcademy();return;}
  if(b.dataset.backProgram){ui.program=b.dataset.backProgram;ui.course=null;ui.lesson=null;renderAcademy();return;}
  if(b.dataset.backCourse){ui.course=b.dataset.backCourse;ui.lesson=null;renderAcademy();return;}
  if(b.dataset.completeLesson){
    const l=findLesson(b.dataset.completeLesson);const a=l&&state.lessonAttempts[l.id];
    if(!l||!a||!a.correct){notify('Answer the knowledge check correctly before marking the lesson complete.');return;}
    if(!state.completedLessons.includes(l.id))state.completedLessons.push(l.id);
    persist();renderAcademy();notify('Lesson completion saved.');return;
  }
  if(b.dataset.lessonAnswer!==undefined){
    const l=findLesson(ui.lesson);if(!l)return;
    const selected=Number(b.dataset.lessonAnswer);const correct=selected===l.check.answer;
    state.lessonAttempts[l.id]={selected:selected,correct:correct,at:new Date().toISOString()};
    persist();renderAcademy();return;
  }
  if(b.dataset.retryLesson){const l=findLesson(b.dataset.retryLesson);if(l){delete state.lessonAttempts[l.id];persist();renderAcademy();}return;}
  if(b.dataset.startAssessment){const id=b.dataset.startAssessment;state.assessmentDrafts[id]=[];persist();ui.assessment=id;renderAssessmentView(id);return;}
  if(b.dataset.assessmentChoice!==undefined){
    const c=findCourse(ui.assessment);if(!c)return;
    const qIndex=Number(b.dataset.questionIndex);const answer=Number(b.dataset.assessmentChoice);
    if(!Array.isArray(state.assessmentDrafts[c.id]))state.assessmentDrafts[c.id]=[];
    state.assessmentDrafts[c.id][qIndex]=answer;persist();renderAssessmentView(c.id);return;
  }
  if(b.dataset.submitAssessment){
    const id=b.dataset.submitAssessment;const c=findCourse(id);if(!c)return;
    const qs=lessonsForCourse(c).map(function(l){return l.check;});
    const answers=state.assessmentDrafts[id]||[];
    if(answers.length!==qs.length||qs.some(function(q,i){return answers[i]===undefined;})){notify('Answer every assessment item before submitting.');return;}
    const correct=qs.filter(function(q,i){return answers[i]===q.answer;}).length;const score=Math.round(correct/qs.length*100);
    const previous=state.courseAssessments[id];
    state.courseAssessments[id]={score:score,correct:correct,total:qs.length,passed:score>=PASS_MARK,attempts:(previous?previous.attempts:0)+1,at:new Date().toISOString()};
    delete state.assessmentDrafts[id];persist();ui.assessment=null;renderAcademy();
    notify(score>=PASS_MARK?'Assessment passed. The next course is now available.':'Assessment not passed yet. Review feedback and try again.');return;
  }
  if(b.dataset.recommendNext){const n=recommendedNext();if(!n)return;if(n.type==='lesson'){ui.program=n.program.id;ui.course=n.course.id;ui.lesson=n.lesson.id;}else if(n.type==='assessment'){ui.program=n.program.id;ui.course=n.course.id;ui.assessment=n.course.id;}else {ui.tab='portfolio';ui.program=null;ui.course=null;ui.lesson=null;}renderAcademy();if(n.type==='assessment')renderAssessmentView(n.course.id);return;}
  if(b.dataset.saveProject){
    const id=b.dataset.saveProject;const p=projects.find(function(x){return x.id===id;});if(!p)return;
    const summary=document.getElementById('sf-reflection-'+id);const link=document.getElementById('sf-link-'+id);
    const checked=Array.from(document.querySelectorAll('[data-project-check="'+id+'"]:checked')).map(function(x){return Number(x.dataset.criterion);});
    const reflection=summary?summary.value.trim():'';const url=link?link.value.trim():'';
    if(!reflection&&!url){notify('Add a project reflection or a public artifact link before saving.');return;}
    if(url){try{const u=new URL(url);if(u.protocol!=='https:'&&u.protocol!=='http:')throw new Error('protocol');}catch(err){notify('Enter a valid http or https artifact URL.');return;}}
    state.projects[id]={reflection:reflection,link:url,checked:checked,saved:true,updatedAt:new Date().toISOString()};
    persist();renderAcademy();notify('Project evidence saved to your local portfolio.');return;
  }
  if(b.dataset.saveSql){
    const answer=document.getElementById('sf-sql-answer');const value=answer?answer.value.trim():'';
    if(value.length<12){notify('Write a SQL attempt before saving.');return;}
    const checklist=['sf-sql-where','sf-sql-group','sf-sql-having','sf-sql-grain'].map(function(id){const x=document.getElementById(id);return !!(x&&x.checked);});
    state.projects['sql-practice']={reflection:value,checked:checklist.map(function(v,i){return v?i:-1;}).filter(function(i){return i>=0;}),saved:true,updatedAt:new Date().toISOString()};
    persist();const status=document.getElementById('sf-sql-status');if(status)status.textContent=' Practice attempt saved locally. SQL has not been executed.';notify('SQL practice evidence saved.');return;
  }
  if(b.dataset.export){exportAll();return;}
  if(b.dataset.import){const input=document.getElementById('sf-import-file');if(input)input.click();return;}
}
function renderAssessmentView(courseId){
  const c=findCourse(courseId);if(!c)return;
  ui.course=c.id;ui.lesson=null;ui.assessment=c.id;ui.program=programForCourse(c.id).id;
  const root=document.getElementById('sf-academy-root');const qs=lessonsForCourse(c).map(function(l){return {title:l.title,check:l.check};});
  const answers=state.assessmentDrafts[courseId]||[];
  root.innerHTML='<button class="sf-back" data-back-course="'+c.id+'">← '+esc(c.title)+'</button><div class="sf-detail-head"><div class="sf-tag" style="color:var(--cyan)">Summative course assessment</div><h2>'+esc(c.title)+'</h2><p>Four knowledge-check items. Pass mark: '+PASS_MARK+'%. Your score and feedback are stored locally. This is not a credential or an accredited examination.</p></div>'+qs.map(function(item,i){return '<section class="sf-panel"><div class="sf-tag">Question '+(i+1)+' of '+qs.length+'</div><h3>'+esc(item.check.question)+'</h3>'+item.check.choices.map(function(option,j){return '<button type="button" class="sf-option '+(answers[i]===j?'selected':'')+'" data-assessment-choice="'+j+'" data-question-index="'+i+'">'+String.fromCharCode(65+j)+'. '+esc(option)+'</button>';}).join('')+'</section>';}).join('')+'<div class="sf-actions"><button class="btn primary" data-submit-assessment="'+c.id+'">Submit assessment →</button><button class="btn outline" data-back-course="'+c.id+'">Save draft and return</button></div>';
}
function handleInput(e){
  const id=e.target.id;
  if(id==='sf-units'||id==='sf-price'||id==='sf-cost'||id==='sf-prior')calculateKpi();
  if(id==='sf-p0'||id==='sf-p1'||id==='sf-q0'||id==='sf-q1')calculateElasticity();
  if(id==='sf-target'||id==='sf-costs'||id==='sf-hours')calculateRate();
}
function handleChange(e){
  if(e.target.id==='sf-csv-file'&&e.target.files&&e.target.files[0])readCsv(e.target.files[0]);
}
function nval(id){const el=document.getElementById(id);const n=el?Number(el.value):0;return Number.isFinite(n)?n:0;}
function money(n){return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:2}).format(n);}
function calculateKpi(){
  const units=nval('sf-units'),price=nval('sf-price'),cost=nval('sf-cost'),prior=nval('sf-prior');
  const revenue=units*price;const grossProfit=units*(price-cost);const margin=revenue?grossProfit/revenue*100:0;const growth=prior?(revenue-prior)/prior*100:null;
  const el=document.getElementById('sf-kpi-output');if(el)el.innerHTML='<b>Current revenue:</b> '+money(revenue)+'<br><b>Gross profit:</b> '+money(grossProfit)+'<br><b>Gross margin:</b> '+margin.toFixed(1)+'%<br><b>Revenue change vs prior:</b> '+(growth===null?'Not available (prior revenue is zero)':growth.toFixed(1)+'%')+'<br><span class="sf-muted-small">Assumes unit price and unit cost use the same currency and period.</span>';
}
function calculateElasticity(){
  const p0=nval('sf-p0'),p1=nval('sf-p1'),q0=nval('sf-q0'),q1=nval('sf-q1');
  const pd=(p1-p0)/((p1+p0)/2),qd=(q1-q0)/((q1+q0)/2);const el=document.getElementById('sf-elasticity-output');
  if(!el)return;
  if(p0<=0||p1<=0||q0<=0||q1<=0||pd===0){el.textContent='Enter positive prices and quantities, and use a non-zero price change.';return;}
  const value=qd/pd;
  el.innerHTML='<b>Midpoint price elasticity:</b> '+value.toFixed(3)+'<br><b>Interpretation:</b> '+(Math.abs(value)>1?'Elastic response in this two-point comparison.':Math.abs(value)<1?'Inelastic response in this two-point comparison.':'Unit elastic in this two-point comparison.')+'<br><span class="sf-muted-small">This arithmetic does not isolate a causal price effect from other factors.</span>';
}
function calculateRate(){
  const target=nval('sf-target'),costs=nval('sf-costs'),hours=nval('sf-hours');const el=document.getElementById('sf-rate-output');if(!el)return;
  if(hours<=0){el.textContent='Enter billable hours greater than zero.';return;}
  el.innerHTML='<b>Estimated minimum hourly rate:</b> '+money((target+costs)/hours)+'<br><span class="sf-muted-small">This excludes tax, unpaid leave, payment risk and additional contingency unless included in your inputs.</span>';
}
function parseCsv(text){
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i],next=text[i+1];
    if(ch==='"'&&quoted&&next==='"'){field+='"';i++;}
    else if(ch==='"'){quoted=!quoted;}
    else if(ch===','&&!quoted){row.push(field);field='';}
    else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&next==='\n')i++;row.push(field);if(row.some(function(v){return String(v).trim()!=='';}))rows.push(row);row=[];field='';}
    else field+=ch;
  }
  row.push(field);if(row.some(function(v){return String(v).trim()!=='';}))rows.push(row);
  return rows;
}
function readCsv(file){
  if(file.size>5*1024*1024){notify('For this browser exercise, choose a CSV file smaller than 5 MB.');return;}
  const reader=new FileReader();
  reader.onload=function(){
    try {
      const rows=parseCsv(String(reader.result||'').replace(/^\uFEFF/,''));
      if(rows.length<2){notify('The CSV needs a header row and at least one data row.');return;}
      const headers=rows[0].map(function(x,i){return String(x||'').trim()||('Column '+(i+1));});
      const body=rows.slice(1).map(function(r){return headers.map(function(_,i){return String(r[i]||'').trim();});});
      const seen={};let duplicates=0;body.forEach(function(r){const k=r.join('\u001f');if(seen[k])duplicates++;else seen[k]=1;});
      let missing=0;body.forEach(function(r){r.forEach(function(v){if(v==='')missing++;});});
      const typeInfo=headers.map(function(h,i){const vals=body.map(function(r){return r[i];}).filter(Boolean);const num=vals.filter(function(v){return /^[-+]?\d+(\.\d+)?$/.test(v.replace(/,/g,''));}).length;return {name:h,type:vals.length&&num/vals.length>=.8?'Mostly numeric':'Text / mixed'};});
      csvReport={name:file.name,rows:body.length,columns:headers.length,duplicates:duplicates,missing:missing,headers:headers,types:typeInfo,preview:body.slice(0,5)};
      renderCsvReport();
    } catch(err){notify('The CSV could not be parsed. Check the delimiter and quotation marks.');}
  };
  reader.onerror=function(){notify('The browser could not read this CSV file.');};
  reader.readAsText(file);
}
function renderCsvReport(){
  const box=document.getElementById('sf-csv-output');if(!box||!csvReport)return;
  const preview='<div class="sf-table-wrap"><table class="sf-table"><thead><tr>'+csvReport.headers.map(function(h){return '<th>'+esc(h)+'</th>';}).join('')+'</tr></thead><tbody>'+csvReport.preview.map(function(r){return '<tr>'+r.map(function(v){return '<td>'+esc(v)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';
  box.innerHTML='<div class="sf-kpis"><div class="sf-kpi"><strong>'+csvReport.rows+'</strong><span>Data rows</span></div><div class="sf-kpi"><strong>'+csvReport.columns+'</strong><span>Columns</span></div><div class="sf-kpi"><strong>'+csvReport.missing+'</strong><span>Blank cells</span></div><div class="sf-kpi"><strong>'+csvReport.duplicates+'</strong><span>Exact duplicate rows</span></div></div><h4 style="font-size:11px">Column profile</h4><div class="sf-meta">'+csvReport.types.map(function(t){return '<span class="sf-pill">'+esc(t.name)+': '+t.type+'</span>';}).join('')+'</div><p class="sf-muted-small">Preview of first five rows · File was processed locally in the browser; contents were not uploaded.</p>'+preview;
}
function exportAll(){
  const legacyRaw=localStorage.getItem('skillforge:v1:state');let legacy=null;
  try{legacy=legacyRaw?JSON.parse(legacyRaw):null;}catch(e){}
  const bundle={product:'SkillForge',schemaVersion:2,exportedAt:new Date().toISOString(),legacyChallengeProgress:legacy,academy:{version:state.version,state:state},notice:'Learning records are learner-entered local progress data. Project evidence and competency indicators are not independently verified.'};
  const blob=new Blob([JSON.stringify(bundle,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='skillforge-complete-learning-record.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);notify('Combined SkillForge learning record exported.');
}
function importRecord(file){
  const reader=new FileReader();
  reader.onload=function(){
    try{
      const bundle=JSON.parse(String(reader.result||''));
      if(bundle.product!=='SkillForge')throw new Error('wrong product');
      const incoming=bundle.academy&&bundle.academy.state;
      if(incoming&&incoming.version===1){
        const f=emptyState();
        state=Object.assign(f,incoming,{
          enrolledPrograms:Array.isArray(incoming.enrolledPrograms)?incoming.enrolledPrograms:[],
          completedLessons:Array.isArray(incoming.completedLessons)?incoming.completedLessons:[],
          lessonAttempts:incoming.lessonAttempts||{},courseAssessments:incoming.courseAssessments||{},
          assessmentDrafts:incoming.assessmentDrafts||{},projects:incoming.projects||{}
        });
        persist();
      }
      if(bundle.legacyChallengeProgress&&bundle.legacyChallengeProgress.version===1){
        localStorage.setItem('skillforge:v1:state',JSON.stringify(bundle.legacyChallengeProgress));
      }
      renderAcademy();notify('SkillForge learning record imported on this device.');
    }catch(e){notify('Import failed. Choose a valid SkillForge JSON export.');}
  };
  reader.onerror=function(){notify('The selected file could not be read.');};
  reader.readAsText(file);
}
function installCombinedExport(){
  ['exportSide','topExport','progressExport','progressExport2'].forEach(function(id){
    const el=document.getElementById(id);if(!el)return;
    el.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();exportAll();},true);
  });
}
function setupImportControl(){
  const root=document.getElementById('view-academy');
  if(!root)return;
  const input=document.createElement('input');input.type='file';input.id='sf-import-file';input.accept='application/json,.json';input.className='sf-hidden';input.setAttribute('aria-label','Import a SkillForge learning record');
  input.addEventListener('change',function(){if(input.files&&input.files[0])importRecord(input.files[0]);input.value='';});
  root.appendChild(input);
}
function renderFooterActions(){
  const root=document.getElementById('sf-academy-root');
  if(!root||!ui.tab)return;
  if(root.querySelector('.sf-data-actions'))return;
  const row=document.createElement('div');row.className='sf-actions sf-data-actions';
  row.innerHTML='<button class="btn outline" data-export="1">Export complete learning record</button><button class="btn outline" data-import="1">Import learning record</button><span class="sf-muted" style="align-self:center">Progress is stored in this browser.</span>';
  root.appendChild(row);
}
function enhanceExistingExport(){
  const buttonIds=['exportSide','topExport','progressExport','progressExport2'];
  buttonIds.forEach(function(id){
    const el=document.getElementById(id);
    if(el)el.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();exportAll();},true);
  });
}
function init(){
  insertStyles();setupView();setupImportControl();enhanceExistingExport();
  calculateKpi();calculateElasticity();calculateRate();updateHomeSummary();
  window.addEventListener('storage',function(e){if(e.key===STORAGE_KEY){state=loadState();renderAcademy();}});
  renderAcademy();renderFooterActions();
}
init();

})();