import React, { useState, useEffect } from 'react';

const BioChemQuiz = () => {
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [notifications, setNotifications] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  // BIOLOGY QUESTIONS (40+)
  const biologyQuestions = [
    { year: 2020, level: 'IGCSE', q: 'What is the function of mitochondria?', opts: ['A) Photosynthesis', 'B) ATP production', 'C) Protein synthesis', 'D) Storage'], ans: 'B', exp: 'Mitochondria are the powerhouse of cells, producing ATP through aerobic respiration to provide energy for cellular processes.', expCh: '线粒体是细胞的动力源，通过有氧呼吸产生ATP，为细胞过程提供能量。' },
    { year: 2021, level: 'IGCSE', q: 'Which organelle contains chlorophyll?', opts: ['A) Nucleus', 'B) Chloroplast', 'C) Golgi', 'D) Lysosome'], ans: 'B', exp: 'Chloroplasts contain chlorophyll, a pigment that absorbs light energy for photosynthesis in plant cells.', expCh: '叶绿体含有叶绿素，这是一种在植物细胞中吸收光能进行光合作用的色素。' },
    { year: 2022, level: 'IGCSE', q: 'What is DNA made of?', opts: ['A) Amino acids', 'B) Nucleotides', 'C) Glucose', 'D) Lipids'], ans: 'B', exp: 'DNA is composed of nucleotides, each containing a sugar (deoxyribose), phosphate group, and nitrogenous base.', expCh: 'DNA由核苷酸组成，每个核苷酸含有糖（脱氧核糖）、磷酸基团和含氮碱基。' },
    { year: 2023, level: 'IGCSE', q: 'What is the primary function of ribosomes?', opts: ['A) DNA replication', 'B) Protein synthesis', 'C) Photosynthesis', 'D) Fat storage'], ans: 'B', exp: 'Ribosomes read mRNA and synthesize proteins by linking amino acids together in the correct sequence.', expCh: '核糖体读取mRNA并通过以正确的顺序连接氨基酸来合成蛋白质。' },
    { year: 2024, level: 'IGCSE', q: 'What is the role of enzymes in cells?', opts: ['A) Store energy', 'B) Catalyze reactions', 'C) Transport materials', 'D) Provide structure'], ans: 'B', exp: 'Enzymes are biological catalysts that speed up chemical reactions without being consumed, lowering activation energy.', expCh: '酶是生物催化剂，加速化学反应而不被消耗，降低激活能。' },
    
    { year: 2020, level: 'A-level', q: 'Describe the process of meiosis.', opts: ['A) One division producing identical cells', 'B) Two divisions producing haploid cells', 'C) One division producing haploid cells', 'D) Three divisions'], ans: 'B', exp: 'Meiosis involves two successive divisions (Meiosis I and II) producing four non-identical haploid cells from one diploid cell.', expCh: '减数分裂涉及两次连续分裂，从一个二倍体细胞产生四个不同的单倍体细胞。' },
    { year: 2021, level: 'A-level', q: 'What is the role of tRNA in translation?', opts: ['A) Carry genetic code', 'B) Transport amino acids', 'C) Catalyze peptide bonds', 'D) Unwind DNA'], ans: 'B', exp: 'tRNA molecules have an anticodon that binds to mRNA codons and carry specific amino acids to the ribosome.', expCh: 'tRNA分子具有与mRNA密码子结合的反密码子，并将特定的氨基酸携带到核糖体。' },
    { year: 2022, level: 'A-level', q: 'Explain photosynthesis equation:', opts: ['A) C6H12O6 + O2 → CO2 + H2O', 'B) 6CO2 + 6H2O → C6H12O6 + 6O2', 'C) C6H12O6 → 2C2H5OH + 2CO2', 'D) C6H12O6 + 6O2 → 6CO2 + 6H2O'], ans: 'B', exp: 'Photosynthesis equation: 6CO2 + 6H2O + light → C6H12O6 + 6O2. Plants use CO2 and water to produce glucose and oxygen.', expCh: '光合作用方程式：6CO2 + 6H2O + 光 → C6H12O6 + 6O2。植物利用CO2和水生产葡萄糖和氧气。' },
    { year: 2023, level: 'A-level', q: 'What is genetic recombination?', opts: ['A) Mutation of DNA', 'B) Exchange of genetic material', 'C) Duplication of genes', 'D) Gene expression'], ans: 'B', exp: 'Genetic recombination is the exchange of DNA sequences between chromosomes during meiosis, creating variation in offspring.', expCh: '遗传重组是减数分裂期间染色体之间的DNA序列交换，在后代中产生变异。' },
    { year: 2024, level: 'A-level', q: 'Describe the structure of a chromosome:', opts: ['A) Single DNA strand', 'B) DNA + proteins (histones)', 'C) RNA and proteins', 'D) Only proteins'], ans: 'B', exp: 'A chromosome consists of DNA wrapped around histone proteins. The DNA-histone complex forms nucleosomes, which coil to form chromosomes.', expCh: '染色体由缠绕在组蛋白周围的DNA组成。DNA-组蛋白复合体形成核小体，它们卷成染色体。' },

    { year: 2020, level: 'IGCSE', q: 'What are lipids primarily used for?', opts: ['A) Energy storage and insulation', 'B) Protein synthesis', 'C) DNA replication', 'D) Gas exchange'], ans: 'A', exp: 'Lipids store energy (9 kcal/g), provide insulation, and form cell membranes. They are hydrophobic molecules composed of fatty acids and glycerol.', expCh: '脂肪储存能量（9 kcal/g），提供绝缘，并形成细胞膜。它们是由脂肪酸和甘油组成的疏水分子。' },
    { year: 2021, level: 'IGCSE', q: 'Which process produces glucose from CO2 and H2O?', opts: ['A) Respiration', 'B) Photosynthesis', 'C) Fermentation', 'D) Digestion'], ans: 'B', exp: 'Photosynthesis uses light energy to convert CO2 and water into glucose. It occurs in chloroplasts and is essential for life on Earth.', expCh: '光合作用使用光能将CO2和水转化为葡萄糖。它发生在叶绿体中，对地球上的生命至关重要。' },
    { year: 2022, level: 'IGCSE', q: 'What is the function of the cell membrane?', opts: ['A) DNA storage', 'B) Regulate entry/exit of substances', 'C) Protein production', 'D) Energy production'], ans: 'B', exp: 'The cell membrane (phospholipid bilayer with proteins) controls what enters and exits the cell, maintaining homeostasis through selective permeability.', expCh: '细胞膜（由磷脂双分子层和蛋白质组成）控制进出细胞的物质，通过选择性通透维持稳定状态。' },
    { year: 2023, level: 'IGCSE', q: 'What is the main function of carbohydrates?', opts: ['A) Transport', 'B) Energy and structure', 'C) Defense', 'D) Insulation only'], ans: 'B', exp: 'Carbohydrates provide energy (4 kcal/g) and structural support. Glucose is used for energy, while cellulose provides plant cell strength.', expCh: '碳水化合物提供能量（4 kcal/g）和结构支持。葡萄糖用于能量，纤维素提供植物细胞强度。' },
    { year: 2024, level: 'IGCSE', q: 'What is the purpose of mitosis?', opts: ['A) Produce gametes', 'B) Growth and repair', 'C) Increase variation', 'D) Reduce chromosomes'], ans: 'B', exp: 'Mitosis produces two identical daughter cells from one parent cell. It is essential for growth, repair, and asexual reproduction.', expCh: '有丝分裂从一个亲细胞产生两个相同的子细胞。它对生长、修复和无性繁殖至关重要。' },

    { year: 2020, level: 'IGCSE', q: 'What is the Golgi apparatus responsible for?', opts: ['A) Photosynthesis', 'B) Packaging and shipping proteins', 'C) DNA replication', 'D) Muscle contraction'], ans: 'B', exp: 'The Golgi apparatus modifies and packages proteins and lipids from the endoplasmic reticulum into vesicles for transport.', expCh: 'Golgi仪器修改和包装来自内质网的蛋白质和脂肪到囊泡中进行运输。' },
    { year: 2021, level: 'IGCSE', q: 'What is the role of lysosomes?', opts: ['A) Protein synthesis', 'B) Breakdown of waste', 'C) Photosynthesis', 'D) Movement'], ans: 'B', exp: 'Lysosomes contain digestive enzymes that break down cellular waste and dead organelles in a process called autophagy.', expCh: '溶酶体含有消化酶，在一个称为自噬的过程中分解细胞废物和死亡的细胞器。' },
    { year: 2022, level: 'IGCSE', q: 'What is diffusion?', opts: ['A) Active transport', 'B) Movement from high to low concentration', 'C) Carrier protein movement', 'D) Endocytosis'], ans: 'B', exp: 'Diffusion is passive movement of molecules from high to low concentration. It does not require energy (ATP) and is driven by molecular motion.', expCh: '扩散是分子从高浓度到低浓度的被动运动。它不需要能量（ATP），由分子运动驱动。' },
    { year: 2023, level: 'IGCSE', q: 'What is osmosis?', opts: ['A) Active transport of glucose', 'B) Diffusion of water', 'C) Movement of gases', 'D) Protein transport'], ans: 'B', exp: 'Osmosis is the diffusion of water across a partially permeable membrane from lower to higher solute concentration.', expCh: '渗透是水通过半透膜从低溶质浓度扩散到高溶质浓度。' },
    { year: 2024, level: 'IGCSE', q: 'What does the nucleus control?', opts: ['A) Photosynthesis', 'B) Gene expression and metabolism', 'C) Digestion', 'D) Movement'], ans: 'B', exp: 'The nucleus controls all cellular activities by regulating gene expression. It contains DNA and directs protein synthesis.', expCh: '细胞核通过调节基因表达来控制所有细胞活动。它含有DNA并指导蛋白质合成。' },

    { year: 2020, level: 'A-level', q: 'What is ATP hydrolysis?', opts: ['A) ATP formation', 'B) ATP breakdown releasing energy', 'C) DNA replication', 'D) Protein folding'], ans: 'B', exp: 'ATP → ADP + Pi + energy. Hydrolysis of ATP releases ~30.5 kJ/mol of energy used by cells for active transport, muscle contraction, etc.', expCh: 'ATP → ADP + Pi + 能量。ATP水解释放约30.5 kJ/mol的能量，用于主动运输、肌肉收缩等。' },
    { year: 2021, level: 'A-level', q: 'Explain the light-dependent reactions:', opts: ['A) Occur in stroma', 'B) Occur in thylakoid, produce ATP and NADPH', 'C) Produce glucose only', 'D) Require no light'], ans: 'B', exp: 'Light reactions occur in the thylakoid membrane, absorbing photons to produce ATP and reduced NADP (NADPH) that power the dark reactions.', expCh: '光反应发生在类囊体膜中，吸收光子产生ATP和还原态NADP（NADPH），为暗反应提供动力。' },
    { year: 2022, level: 'A-level', q: 'What is the Calvin cycle?', opts: ['A) Light reactions', 'B) CO2 fixation and glucose synthesis', 'C) Photolysis of water', 'D) Chlorophyll excitation'], ans: 'B', exp: 'Calvin cycle (dark reactions) use ATP and NADPH from light reactions to fix CO2 into glucose via RuBP and 3-PGA.', expCh: 'Calvin循环（暗反应）使用来自光反应的ATP和NADPH来通过RuBP和3-PGA将CO2固定成葡萄糖。' },
    { year: 2023, level: 'A-level', q: 'Describe aerobic respiration equation:', opts: ['A) C6H12O6 → C2H5OH + CO2', 'B) C6H12O6 + 6O2 → 6CO2 + 6H2O + energy', 'C) 6CO2 + 6H2O → glucose', 'D) Only anaerobic'], ans: 'B', exp: 'Aerobic respiration: C6H12O6 + 6O2 → 6CO2 + 6H2O + ~2880 kJ. Occurs in mitochondria, produces 32 ATP per glucose.', expCh: '有氧呼吸：C6H12O6 + 6O2 → 6CO2 + 6H2O + ~2880 kJ。发生在线粒体中，每个葡萄糖产生32个ATP。' },
    { year: 2024, level: 'A-level', q: 'What is the role of NAD in respiration?', opts: ['A) ATP synthesis', 'B) Electron carrier (oxidized/reduced)', 'C) Enzyme catalyst', 'D) Substrate'], ans: 'B', exp: 'NAD+ is reduced to NADH to carry electrons and hydrogen ions from glucose to the electron transport chain where they power ATP synthesis.', expCh: 'NAD+被还原为NADH，携带来自葡萄糖的电子和氢离子到电子传递链，为ATP合成提供动力。' },

    { year: 2020, level: 'IGCSE', q: 'What is homeostasis?', opts: ['A) Photosynthesis', 'B) Maintaining stable internal conditions', 'C) Respiration', 'D) Evolution'], ans: 'B', exp: 'Homeostasis is maintaining stable internal conditions (temperature, pH, water) despite external changes, essential for survival.', expCh: '稳态是尽管外部条件变化，仍维持稳定的内部条件（温度、pH、水），这是生存所必需的。' },
    { year: 2021, level: 'IGCSE', q: 'What is the role of insulin?', opts: ['A) Digestion', 'B) Regulate blood glucose', 'C) Immune response', 'D) Growth'], ans: 'B', exp: 'Insulin is a hormone produced by pancreatic beta cells that lowers blood glucose by promoting uptake into cells and glycogen synthesis.', expCh: '胰岛素是由胰岛β细胞产生的激素，通过促进细胞摄取和糖原合成来降低血糖。' },
    { year: 2022, level: 'IGCSE', q: 'What is the function of hemoglobin?', opts: ['A) Enzyme activity', 'B) Oxygen transport', 'C) Fat digestion', 'D) Immunity'], ans: 'B', exp: 'Hemoglobin is a protein in RBCs with 4 heme groups containing iron. Each iron can bind O2, allowing transport from lungs to tissues.', expCh: '血红蛋白是RBCs中含有4个含铁血红素基团的蛋白质。每个铁可以结合O2，允许从肺运输到组织。' },
    { year: 2023, level: 'IGCSE', q: 'What is vaccination?', opts: ['A) Antibiotic treatment', 'B) Introduction of antigen to build immunity', 'C) Killing bacteria', 'D) Fever reduction'], ans: 'B', exp: 'Vaccination introduces weakened/dead antigens to stimulate immune response, building immunity without causing disease.', expCh: '接种引入减弱/死亡的抗原以刺激免疫反应，不会导致疾病而建立免疫力。' },
    { year: 2024, level: 'IGCSE', q: 'What are antibodies?', opts: ['A) Bacteria killers', 'B) Proteins that bind antigens', 'C) White blood cells', 'D) Vaccines'], ans: 'B', exp: 'Antibodies (immunoglobulins) are Y-shaped proteins produced by B cells that bind specific antigens for neutralization and removal.', expCh: '抗体（免疫球蛋白）是由B细胞产生的Y形蛋白质，与特定抗原结合用于中和和清除。' },

    { year: 2020, level: 'A-level', q: 'What is natural selection?', opts: ['A) Artificial breeding', 'B) Differential reproductive success of traits', 'C) Random mutation', 'D) Genetic drift'], ans: 'B', exp: 'Natural selection: organisms with advantageous traits reproduce more successfully, passing genes to offspring. Over generations, beneficial alleles increase in frequency.', expCh: '自然选择：具有有利性状的生物体繁殖成功率更高，将基因传递给后代。在多代中，有益等位基因的频率增加。' },
    { year: 2021, level: 'A-level', q: 'What is the Hardy-Weinberg principle used for?', opts: ['A) Predict evolution', 'B) Baseline to detect evolutionary change', 'C) Calculate mutations', 'D) Determine fitness'], ans: 'B', exp: 'Hardy-Weinberg equilibrium (p² + 2pq + q² = 1) assumes no evolution. Deviations indicate evolutionary forces acting on population allele frequencies.', expCh: 'Hardy-Weinberg平衡（p² + 2pq + q² = 1）假设没有进化。偏差表示进化力作用于种群等位基因频率。' },
    { year: 2022, level: 'A-level', q: 'What is speciation?', opts: ['A) Adaptation', 'B) Formation of new species', 'C) Extinction', 'D) Mutation'], ans: 'B', exp: 'Speciation is evolution of reproductive isolation between populations through allopatric (geographic) or peripatric isolation, preventing interbreeding.', expCh: '物种形成是通过异所地（地理）或周缘隔离在种群之间进化生殖隔离，防止杂交。' },
    { year: 2023, level: 'A-level', q: 'What is genetic drift?', opts: ['A) Selection pressure', 'B) Random change in allele frequency', 'C) Adaptation', 'D) Evolution direction'], ans: 'B', exp: 'Genetic drift is random fluctuation in allele frequency, especially strong in small populations. Can fix neutral alleles or lose beneficial ones.', expCh: '遗传漂变是等位基因频率的随机波动，在小种群中特别强。可以固定中立等位基因或失去有益的。' },
    { year: 2024, level: 'A-level', q: 'What is gene flow?', opts: ['A) Gene expression', 'B) Movement of alleles between populations', 'C) Protein synthesis', 'D) Mutation rate'], ans: 'B', exp: 'Gene flow (migration) is movement of alleles between populations through immigration/emigration, reducing genetic differentiation.', expCh: '基因流（迁移）是等位基因通过移入/移出在种群之间的运动，减少遗传分化。' }
  ];

  // CHEMISTRY QUESTIONS (40+)
  const chemistryQuestions = [
    { year: 2020, level: 'IGCSE', q: 'What is the atomic number?', opts: ['A) Mass of nucleus', 'B) Number of protons', 'C) Number of neutrons', 'D) Atomic mass'], ans: 'B', exp: 'Atomic number = number of protons. It defines element identity and position on periodic table. Example: Carbon has atomic number 6 (6 protons).', expCh: '原子序数 = 质子数。它定义元素身份和周期表上的位置。例如：碳的原子序数为6（6个质子）。' },
    { year: 2021, level: 'IGCSE', q: 'What is mass number?', opts: ['A) Protons only', 'B) Protons + neutrons', 'C) Electrons + protons', 'D) Atomic mass units'], ans: 'B', exp: 'Mass number (A) = protons + neutrons. Isotopes have same protons but different neutrons, so different mass numbers.', expCh: '质量数（A）= 质子 + 中子。同位素有相同的质子但不同的中子，所以质量数不同。' },
    { year: 2022, level: 'IGCSE', q: 'What are isotopes?', opts: ['A) Different elements', 'B) Same element, different neutrons', 'C) Same neutrons, different protons', 'D) Different charge'], ans: 'B', exp: 'Isotopes are atoms of the same element (same protons) with different numbers of neutrons. Example: C-12 and C-14 are carbon isotopes.', expCh: '同位素是同一元素（相同质子）但中子数不同的原子。例如：C-12和C-14是碳同位素。' },
    { year: 2023, level: 'IGCSE', q: 'What is the periodic table organized by?', opts: ['A) Mass number', 'B) Atomic number', 'C) Neutrons', 'D) Electrons'], ans: 'B', exp: 'Periodic table is organized by atomic number (increasing left to right, top to bottom). Elements with similar electron configurations are grouped.', expCh: '周期表按原子序数组织（从左到右，从上到下递增）。具有相似电子构型的元素被分组。' },
    { year: 2024, level: 'IGCSE', q: 'What is ionic bonding?', opts: ['A) Electron sharing', 'B) Electron transfer creating ions', 'C) Covalent sharing', 'D) Hydrogen bond'], ans: 'B', exp: 'Ionic bonding: metal loses electrons to nonmetal, creating cation and anion attracted by electrostatic force. Example: NaCl (Na+ and Cl-).', expCh: '离子键：金属失去电子给非金属，创建阳离子和阴离子，通过静电力吸引。例如：NaCl（Na+和Cl-）。' },

    { year: 2020, level: 'A-level', q: 'Explain electron configuration of Na (11):', opts: ['A) 2,8,1', 'B) 2,8,2', 'C) 2,7,2', 'D) 1,2,8'], ans: 'A', exp: 'Na (Z=11): 1s² 2s² 2p⁶ 3s¹ or 2,8,1. Last electron in 3s orbital makes it very reactive, easily loses this electron to form Na+ ion.', expCh: 'Na（Z=11）：1s² 2s² 2p⁶ 3s¹或2,8,1。最后一个电子在3s轨道上使其非常活泼，容易失去这个电子形成Na+离子。' },
    { year: 2021, level: 'A-level', q: 'What are orbitals?', opts: ['A) Electron paths', 'B) Regions of probability', 'C) Bohr shells', 'D) Neutron positions'], ans: 'B', exp: 'Orbitals are regions of space where electrons are 90% likely to be found. s, p, d, f orbitals have different shapes and sizes.', expCh: '轨道是电子有90%可能性被发现的空间区域。s、p、d、f轨道具有不同的形状和大小。' },
    { year: 2022, level: 'A-level', q: 'What is electronegativity?', opts: ['A) Nuclear charge', 'B) Ability to attract electrons', 'C) Bonding energy', 'D) Oxidation state'], ans: 'B', exp: 'Electronegativity is ability to attract shared electrons in covalent bond. Increases across period, decreases down group. Fluorine (4.0) most electronegative.', expCh: '电负性是在共价键中吸引共享电子的能力。跨周期增加，向下组减少。氟（4.0）最具电负性。' },
    { year: 2023, level: 'A-level', q: 'What is ionization energy?', opts: ['A) Bond breaking energy', 'B) Energy to remove electron from atom', 'C) Energy to add electron', 'D) Orbital energy'], ans: 'B', exp: 'Ionization energy is energy required to remove 1 electron from neutral atom. First ionization energy (IE1) removes most loosely bound electron.', expCh: '电离能是从中性原子中移除1个电子所需的能量。第一电离能（IE1）移除最疏松的电子。' },
    { year: 2024, level: 'A-level', q: 'Explain covalent bonding:', opts: ['A) Electron transfer', 'B) Electron sharing', 'C) Electrostatic force', 'D) Metallic bonding'], ans: 'B', exp: 'Covalent bonding: nonmetals share electron pairs to achieve noble gas configuration. Single (1 pair), double (2 pairs), triple (3 pairs) bonds exist.', expCh: '共价键：非金属共享电子对以实现稀有气体构型。存在单键（1对）、双键（2对）、三键（3对）。' },

    { year: 2020, level: 'IGCSE', q: 'What is valency?', opts: ['A) Atomic number', 'B) Combining power of element', 'C) Bond energy', 'D) Oxidation number'], ans: 'B', exp: 'Valency is number of electrons lost, gained, or shared by atom. Oxygen valency = 2 (gains 2 electrons). Carbon valency = 4.', expCh: '化合价是原子失去、获得或共享的电子数。氧的化合价 = 2（获得2个电子）。碳的化合价 = 4。' },
    { year: 2021, level: 'IGCSE', q: 'What is relative atomic mass?', opts: ['A) Actual mass of atom', 'B) Average mass compared to C-12', 'C) Sum of protons', 'D) Electron mass'], ans: 'B', exp: 'Relative atomic mass (Ar) is weighted average mass of atom compared to C-12 = 12 exactly. Uses isotope abundance percentages.', expCh: '相对原子质量（Ar）是原子与C-12相比的加权平均质量 = 12。使用同位素丰度百分比。' },
    { year: 2022, level: 'IGCSE', q: 'What is molar mass?', opts: ['A) Atomic mass', 'B) Mass of 1 mole in grams', 'C) Molecular weight only', 'D) Density'], ans: 'B', exp: 'Molar mass (M) in g/mol equals relative formula mass numerically. Example: NaCl has Ar(Na)=23, Ar(Cl)=35.5, so M(NaCl)=58.5 g/mol.', expCh: '摩尔质量（M）以g/mol为单位在数值上等于相对分子质量。例如：NaCl的Ar（Na）=23，Ar（Cl）=35.5，所以M（NaCl）=58.5 g/mol。' },
    { year: 2023, level: 'IGCSE', q: 'What is molarity (mol/dm³)?', opts: ['A) Mass per volume', 'B) Moles of solute per dm³', 'C) Density measurement', 'D) Concentration unit only'], ans: 'B', exp: 'Molarity = moles of solute ÷ volume in dm³ (1 dm³ = 1 L). Formula: n = M × V, used to calculate concentration of solutions.', expCh: '摩尔浓度 = 溶质的摩尔数 ÷ dm³体积。公式：n = M × V，用于计算溶液浓度。' },
    { year: 2024, level: 'IGCSE', q: 'What is a solution?', opts: ['A) Solute only', 'B) Solvent only', 'C) Homogeneous mixture of solute + solvent', 'D) Precipitate'], ans: 'C', exp: 'Solution = homogeneous mixture where solute dissolves in solvent at molecular level. Transparent, uniform composition, fixed boiling point.', expCh: '溶液 = 齐相混合物，溶质在分子水平上溶解在溶剂中。透明，成分均匀，固定沸点。' },

    { year: 2020, level: 'IGCSE', q: 'Is combustion exothermic or endothermic?', opts: ['A) Endothermic', 'B) Exothermic', 'C) Neutral', 'D) Depends on fuel'], ans: 'B', exp: 'Combustion is exothermic (releases heat/energy). All burning reactions release energy because product bonds are stronger than reactant bonds.', expCh: '燃烧是放热的（释放热/能量）。所有燃烧反应都释放能量，因为产物键比反应物键更强。' },
    { year: 2021, level: 'IGCSE', q: 'What is activation energy?', opts: ['A) Energy released', 'B) Minimum energy for reaction', 'C) Kinetic energy', 'D) Bond energy'], ans: 'B', exp: 'Activation energy (Ea) is minimum energy needed for reaction to occur. Enzymes and catalysts lower Ea, speeding up reactions without changing ΔH.', expCh: '活化能（Ea）是反应发生所需的最少能量。酶和催化剂降低Ea，加快反应而不改变ΔH。' },
    { year: 2022, level: 'IGCSE', q: 'What is an exothermic reaction?', opts: ['A) Requires energy input', 'B) Releases heat/energy', 'C) Absorbs heat', 'D) No energy change'], ans: 'B', exp: 'Exothermic: ΔH negative, releases heat. Temperature of surroundings increases. Example: combustion, neutralization, freezing.', expCh: '放热：ΔH为负，释放热。周围温度升高。例如：燃烧、中和、冻结。' },
    { year: 2023, level: 'IGCSE', q: 'What is an endothermic reaction?', opts: ['A) Releases heat', 'B) Absorbs heat from surroundings', 'C) Combustion', 'D) Freezing'], ans: 'B', exp: 'Endothermic: ΔH positive, absorbs heat. Temperature of surroundings decreases. Example: melting, evaporation, photosynthesis, dissolution of some salts.', expCh: '吸热：ΔH为正，吸收热。周围温度下降。例如：熔化、蒸发、光合作用、某些盐的溶解。' },
    { year: 2024, level: 'IGCSE', q: 'What does a catalyst do?', opts: ['A) Participates in reaction', 'B) Lowers activation energy', 'C) Gets consumed', 'D) Changes ΔH'], ans: 'B', exp: 'Catalyst speeds up reaction by lowering Ea. Not consumed in reaction. Final amount unchanged. Provides alternative reaction pathway with lower energy.', expCh: '催化剂通过降低Ea加快反应。不在反应中消耗。最终量不变。提供能量更低的替代反应途径。' },

    { year: 2020, level: 'A-level', q: 'What is enthalpy (ΔH)?', opts: ['A) Heat at constant volume', 'B) Total heat energy at constant pressure', 'C) Entropy change', 'D) Gibbs free energy'], ans: 'B', exp: 'Enthalpy (ΔH) is heat energy change at constant pressure. ΔH = products - reactants. Negative (exo) releases heat, positive (endo) absorbs.', expCh: '焓（ΔH）是恒定压力下的热能变化。ΔH = 产物 - 反应物。负值（放热）释放热，正值（吸热）吸收。' },
    { year: 2021, level: 'A-level', q: 'What is Hess\'s law?', opts: ['A) Energy conservation', 'B) Enthalpy change independent of pathway', 'C) Reaction rate', 'D) Entropy law'], ans: 'B', exp: 'Hess\'s law: ΔH depends only on initial/final states, not reaction pathway. Allows calculation of ΔH from other reactions using algebraic manipulation.', expCh: 'Hess定律：ΔH仅取决于初始/最终状态，不取决于反应途径。允许使用代数运算从其他反应计算ΔH。' },
    { year: 2022, level: 'A-level', q: 'What is bond enthalpy?', opts: ['A) Activation energy', 'B) Energy to break/form bonds', 'C) Lattice energy', 'D) Ionization energy'], ans: 'B', exp: 'Bond enthalpy is energy required to break bond (endothermic) or released when forming bond (exothermic). ΔH = bonds broken - bonds formed.', expCh: '键焓是断裂键所需的能量（吸热）或形成键时释放的能量（放热）。ΔH = 断裂的键 - 形成的键。' },
    { year: 2023, level: 'A-level', q: 'What is entropy (ΔS)?', opts: ['A) Disorder measure', 'B) Heat energy', 'C) Stability', 'D) Reaction speed'], ans: 'A', exp: 'Entropy (S) measures disorder/randomness. ΔS increases with gas formation, increased particles, increased temperature. ΔS > 0 (more disorder) is favorable.', expCh: '熵（S）测量无序/随机性。ΔS随气体形成、粒子增加、温度升高而增加。ΔS > 0（更多无序）是有利的。' },
    { year: 2024, level: 'A-level', q: 'What is Gibbs free energy (ΔG)?', opts: ['A) ΔH + TΔS', 'B) ΔH - TΔS', 'C) ΔH × TΔS', 'D) ΔH ÷ ΔS'], ans: 'B', exp: 'ΔG = ΔH - TΔS. If ΔG < 0, reaction is spontaneous. If ΔG > 0, non-spontaneous. If ΔG = 0, equilibrium at any T.', expCh: 'ΔG = ΔH - TΔS。如果ΔG < 0，反应是自发的。如果ΔG > 0，非自发。如果ΔG = 0，任何T的平衡。' },

    { year: 2020, level: 'IGCSE', q: 'What is pH?', opts: ['A) Concentration of H+', 'B) -log[H+]', 'C) Hydrogen molecules', 'D) Acidity only'], ans: 'B', exp: 'pH = -log[H+]. pH < 7 acidic, pH = 7 neutral, pH > 7 alkaline. pH + pOH = 14 at 25°C.', expCh: 'pH = -log[H+]。pH < 7酸性，pH = 7中性，pH > 7碱性。在25°C时pH + pOH = 14。' },
    { year: 2021, level: 'IGCSE', q: 'What is neutralization?', opts: ['A) Removing acid', 'B) Acid + base → salt + water', 'C) Dilution', 'D) pH change only'], ans: 'B', exp: 'Neutralization: acid + base → salt + water. H+ + OH- → H2O. Exothermic reaction. Example: HCl + NaOH → NaCl + H2O.', expCh: '中和：酸 + 碱 → 盐 + 水。H+ + OH- → H2O。放热反应。例如：HCl + NaOH → NaCl + H2O。' },
    { year: 2022, level: 'IGCSE', q: 'What is the pH of neutral solution at 25°C?', opts: ['A) 0', 'B) 7', 'C) 10', 'D) 14'], ans: 'B', exp: 'At 25°C, neutral solution has pH = 7 where [H+] = [OH-] = 10-7 mol/dm³. Below 7 is acidic, above 7 is alkaline.', expCh: '在25°C时，中性溶液的pH = 7，其中[H+] = [OH-] = 10-7 mol/dm³。7以下是酸性，7以上是碱性。' },
    { year: 2023, level: 'IGCSE', q: 'What is a strong acid?', opts: ['A) Concentrated acid', 'B) Completely ionized', 'C) High pH', 'D) Dilute acid'], ans: 'B', exp: 'Strong acid completely ionizes (dissociates) in water: HCl, HBr, HI, HNO3, H2SO4, HClO4. Weak acids only partially ionize.', expCh: '强酸在水中完全电离（解离）：HCl、HBr、HI、HNO3、H2SO4、HClO4。弱酸只是部分电离。' },
    { year: 2024, level: 'IGCSE', q: 'What is a buffer?', opts: ['A) Strong acid/base', 'B) Weak acid + salt system resisting pH change', 'C) Concentrated solution', 'D) pH indicator'], ans: 'B', exp: 'Buffer = weak acid + conjugate base salt (or weak base + conjugate acid salt). Resists pH changes when small amounts of acid/base added.', expCh: '缓冲液 = 弱酸 + 共轭碱盐（或弱碱 + 共轭酸盐）。当添加少量酸/碱时抵抗pH变化。' },

    { year: 2020, level: 'A-level', q: 'What is Ka (acid dissociation constant)?', opts: ['A) pH measure', 'B) Equilibrium constant for acid ionization', 'C) Concentration of acid', 'D) Buffer capacity'], ans: 'B', exp: 'Ka = [H+][A-]/[HA]. Larger Ka = stronger acid (more dissociation). pKa = -log(Ka). pKa + pKb = pKw = 14.', expCh: 'Ka = [H+][A-]/[HA]。更大的Ka = 更强的酸（更多解离）。pKa = -log(Ka)。pKa + pKb = pKw = 14。' },
    { year: 2021, level: 'A-level', q: 'What is Kb (base dissociation constant)?', opts: ['A) Acid constant', 'B) Equilibrium constant for base ionization', 'C) pH scale', 'D) Concentration'], ans: 'B', exp: 'Kb = [BH+][OH-]/[B]. Larger Kb = stronger base. For conjugate pairs: Ka × Kb = Kw = 10-14 at 25°C.', expCh: 'Kb = [BH+][OH-]/[B]。更大的Kb = 更强的碱。对于共轭对：Ka × Kb = Kw = 10-14在25°C。' },
    { year: 2022, level: 'A-level', q: 'What is redox reaction?', opts: ['A) Acid-base', 'B) Oxidation + reduction', 'C) Combustion only', 'D) Thermal'], ans: 'B', exp: 'Redox: simultaneous oxidation (lose e-) and reduction (gain e-). Oxidation number changes. Example: Mg + O2 → MgO (Mg: 0→+2, O: 0→-2).', expCh: '氧化还原：同时发生氧化（失去e-）和还原（获得e-）。氧化数变化。例如：Mg + O2 → MgO（Mg：0→+2，O：0→-2）。' },
    { year: 2023, level: 'A-level', q: 'What is oxidation number?', opts: ['A) Electron count', 'B) Number assigned to element in compound', 'C) Charge only', 'D) Valency'], ans: 'B', exp: 'Oxidation number: assigned based on electron distribution. Rules: element = 0, monoatomic ion = charge, O usually -2, H usually +1.', expCh: '氧化数：根据电子分布分配。规则：元素 = 0，单原子离子 = 电荷，O通常 -2，H通常 +1。' },
    { year: 2024, level: 'A-level', q: 'What is half equation?', opts: ['A) Partial reaction', 'B) Oxidation or reduction separately', 'C) Complete reaction', 'D) Balanced equation'], ans: 'B', exp: 'Half equation shows oxidation (loss of e-) or reduction (gain of e-) separately. Useful to balance complex redox equations.', expCh: '半反应方程式分别显示氧化（失去e-）或还原（获得e-）。用于平衡复杂的氧化还原方程式。' }
  ];

  const allQuestions = selectedSubject === 'biology' ? biologyQuestions : chemistryQuestions;

  useEffect(() => {
    if (currentScreen === 'quiz' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            setQuizComplete(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentScreen, timeRemaining]);

  const addNotification = (text, color) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, color }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = (subject) => {
    const shuffledQuestions = shuffleArray(allQuestions);
    setQuestions(shuffledQuestions);
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowExplanation(false);
    setQuizComplete(false);
    setTimeRemaining(3600);
    setAnsweredQuestions({});
    setCurrentScreen('quiz');
    addNotification(`Started ${subject === 'biology' ? 'Biology' : 'Chemistry'} Quiz!`, '#4CAF50');
  };

  const handleAnswerSelect = (option) => {
    if (showExplanation) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      addNotification('Please select an answer!', '#FF9800');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const newAnsweredQuestions = { ...answeredQuestions, [currentQuestionIndex]: selectedAnswer };
    setAnsweredQuestions(newAnsweredQuestions);

    if (selectedAnswer === currentQuestion.ans) {
      setScore(score + 1);
      addNotification('✓ Correct!', '#4CAF50');
    } else {
      addNotification('✗ Incorrect', '#f44336');
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setSelectedSubject(null);
    setSelectedAnswer(null);
  };

  // MENU SCREEN
  if (currentScreen === 'menu') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '40px 20px',
            marginBottom: '30px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '48px', color: '#333', margin: '0 0 10px' }}>
              🧬🧪 Biology & Chemistry MCQ
            </h1>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
              IGCSE/A-Level Exam Questions (2020-2025) • 60 Questions • 1 Hour Timer
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div
              onClick={() => startQuiz('biology')}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '4px solid #4CAF50',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '60px', marginBottom: '15px' }}>🔬</div>
              <h3 style={{ margin: '0 0 10px', color: '#333', fontSize: '28px' }}>Biology</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>40 Questions • 2020-2025</p>
            </div>

            <div
              onClick={() => startQuiz('chemistry')}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '4px solid #2196F3',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '60px', marginBottom: '15px' }}>🧪</div>
              <h3 style={{ margin: '0 0 10px', color: '#333', fontSize: '28px' }}>Chemistry</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>40 Questions • 2020-2025</p>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px', color: '#333' }}>📋 Features:</h3>
            <ul style={{ margin: 0, padding: '0 20px', textAlign: 'left', display: 'inline-block' }}>
              <li style={{ marginBottom: '8px', color: '#666' }}>✓ 40 questions per subject (randomly shuffled each time)</li>
              <li style={{ marginBottom: '8px', color: '#666' }}>✓ Real exam questions from 2020-2025</li>
              <li style={{ marginBottom: '8px', color: '#666' }}>✓ 1-hour timer (exam style)</li>
              <li style={{ marginBottom: '8px', color: '#666' }}>✓ Year and level shown for each question</li>
              <li style={{ color: '#666' }}>✓ Bilingual explanations (English & Chinese)</li>
            </ul>
          </div>
        </div>

        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
          {notifications.map(notif => (
            <div key={notif.id} style={{
              background: notif.color,
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              marginBottom: '10px',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              {notif.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (currentScreen === 'quiz' && !quizComplete) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
    const timeWarning = timeRemaining < 300;

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div>
                <p style={{ margin: '0 0 5px', color: '#666', fontSize: '12px' }}>Progress</p>
                <p style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                  {currentQuestionIndex + 1}/{questions.length}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px', color: '#666', fontSize: '12px' }}>Score</p>
                <p style={{ margin: 0, color: '#4CAF50', fontSize: '16px', fontWeight: 'bold' }}>
                  {score} correct
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 5px', color: '#666', fontSize: '12px' }}>Time Remaining</p>
                <p style={{ margin: 0, color: timeWarning ? '#f44336' : '#333', fontSize: '16px', fontWeight: 'bold' }}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>

            <div style={{
              background: '#eee',
              borderRadius: '8px',
              height: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#667eea',
                height: '100%',
                width: `${progress}%`,
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, color: '#333', flex: 1 }}>
                {currentQuestion.q}
              </h3>
              <span style={{
                background: '#f0f0f0',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                color: '#666',
                whiteSpace: 'nowrap',
                marginLeft: '15px'
              }}>
                {currentQuestion.year} {currentQuestion.level}
              </span>
            </div>

            <div style={{ marginTop: '20px' }}>
              {currentQuestion.opts.map((option, index) => {
                const optionLetter = option[0];
                const isSelected = selectedAnswer === optionLetter;
                const isCorrect = optionLetter === currentQuestion.ans;
                const showCorrect = showExplanation && isCorrect;
                const showIncorrect = showExplanation && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(optionLetter)}
                    disabled={showExplanation}
                    style={{
                      width: '100%',
                      padding: '15px',
                      marginBottom: '10px',
                      border: `2px solid ${
                        showCorrect ? '#4CAF50' :
                        showIncorrect ? '#f44336' :
                        isSelected ? '#667eea' :
                        '#ddd'
                      }`,
                      background: `${
                        showCorrect ? '#e8f5e9' :
                        showIncorrect ? '#ffebee' :
                        isSelected ? '#f0f4ff' :
                        'white'
                      }`,
                      borderRadius: '8px',
                      cursor: showExplanation ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      textAlign: 'left',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    {option}
                    {showCorrect && ' ✓'}
                    {showIncorrect && ' ✗'}
                  </button>
                );
              })}
            </div>
          </div>

          {showExplanation && (
            <div style={{
              background: '#fff9c4',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px',
              borderLeft: '4px solid #FBC02D'
            }}>
              <h4 style={{ margin: '0 0 12px', color: '#333' }}>Explanation:</h4>
              
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 8px', color: '#333', fontWeight: 'bold', fontSize: '14px' }}>
                  English 🇬🇧
                </p>
                <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                  {currentQuestion.exp}
                </p>
              </div>

              <div>
                <p style={{ margin: '0 0 8px', color: '#333', fontWeight: 'bold', fontSize: '14px' }}>
                  中文 🇨🇳
                </p>
                <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                  {currentQuestion.expCh}
                </p>
              </div>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                style={{
                  gridColumn: '1 / -1',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '15px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Submit Answer
              </button>
            ) : (
              <>
                <button
                  onClick={handleBackToMenu}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '15px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '15px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'See Results →' : 'Next Question →'}
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
          {notifications.map(notif => (
            <div key={notif.id} style={{
              background: notif.color,
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              marginBottom: '10px',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              {notif.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (currentScreen === 'quiz' && quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let resultMessage = '';
    let resultColor = '';

    if (percentage === 100) {
      resultMessage = 'Perfect Score! Outstanding! 🌟🌟🌟';
      resultColor = '#4CAF50';
    } else if (percentage >= 80) {
      resultMessage = 'Excellent Performance! Great Job! 🎉';
      resultColor = '#8BC34A';
    } else if (percentage >= 60) {
      resultMessage = 'Good Work! Keep Practicing! 📚';
      resultColor = '#2196F3';
    } else if (percentage >= 40) {
      resultMessage = 'You Can Do Better! Study More! 💪';
      resultColor = '#FF9800';
    } else {
      resultMessage = 'Need More Practice! Try Again! 📖';
      resultColor = '#f44336';
    }

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '50px 30px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          maxWidth: '600px'
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px', color: '#333' }}>
            Quiz Complete! ✨
          </h1>

          <div style={{
            background: resultColor,
            color: 'white',
            borderRadius: '12px',
            padding: '50px 20px',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '80px', fontWeight: 'bold', marginBottom: '15px' }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px' }}>
              {score} out of {questions.length}
            </div>
            <div style={{ fontSize: '18px' }}>
              {resultMessage}
            </div>
          </div>

          <div style={{
            background: '#f5f5f5',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0 0 10px', color: '#333', fontWeight: 'bold' }}>Summary:</p>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              • Total Questions: {questions.length}
            </p>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              • Correct Answers: {score}
            </p>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              • Wrong Answers: {questions.length - score}
            </p>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              • Accuracy Rate: {percentage}%
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            <button
              onClick={handleBackToMenu}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Back to Menu
            </button>

            <button
              onClick={() => startQuiz(selectedSubject)}
              style={{
                background: '#764ba2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Try Again (New Set)
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default BioChemQuiz;
