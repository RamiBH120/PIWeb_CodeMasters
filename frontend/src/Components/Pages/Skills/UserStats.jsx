import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../../../../context/userContext';
import socialSkillService from '../../../services/socialSkill-service';
import { getChecklistScoreForUser } from '../../../services/checklist-service';
import html2canvas from 'html2canvas';
import publicationService from '../../../services/page-service';
import userScoreServicePost from '../../../services/userScoreServicePost';

Chart.register(ArcElement, Tooltip, Legend);

function UserStats() {
  const { user } = useContext(UserContext);
  const [socialScore, setSocialScore] = useState(0);
  const [taskScore, setTaskScore] = useState(0);
  const [publicationScore, setPublicationScore] = useState(0);
  const [pageScore, setPageScore] = useState(0);
  const chartRef = useRef(null); // Référence pour le camembert

  useEffect(() => {
    const fetchScores = async () => {
      try {
        //score Social
        const socialResult = await socialSkillService.getSocialSkillsByUser(user.id);
        let socialSum = 0;
        const socialSkills = Array.isArray(socialResult.socialSkills) ? socialResult.socialSkills : [];
        socialSkills.forEach((skill) => {
          socialSum += skill.pointSocial || 1;
        });
        setSocialScore(socialSum*100);

        //score tache

        const checklistResult = await getChecklistScoreForUser(user.id);
        const taskSum = checklistResult.data.message.somme || 1;
        setTaskScore(taskSum);


        // Score des publications des pages
        const publicationResults = await publicationService.getPublicationsByGroupAndUser(user.id);
        const publicationSum = publicationResults.length; // Utilisez la longueur des publications comme score
        setPageScore(publicationSum);

        // Score des publication générales
        const [reports, likes, dislikes] = await Promise.all([
          userScoreServicePost.getPubReportsById(user.id),
          
          userScoreServicePost.getPubLikesById(user.id),
          userScoreServicePost.getPubDislikesById(user.id),

        ]);
        console.log("R",reports)
        console.log("L",likes)
        console.log("D",dislikes)

        const postScore = calculatePostScore(
          likes,
           dislikes,
            reports
        );
          console.log("postScore",postScore)
        setPublicationScore(postScore);




      } catch (error) {
        console.error("Erreur lors de la récupération des scores:", error.message);
      }
    };

    fetchScores();
  }, [user]);

  const data = {
    labels: ['Points sociaux 🗣️', 'Score des tâches 📋','Score des publications ✍️','Score de Page 📄'],
    datasets: [
      {
        data: [socialScore, taskScore,publicationScore,pageScore],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const chartSize = {
    width: '280px',
    height: '280px',
  };

  const calculatePostScore = (nbrLikes, nbrDislikes, nbrReports) => {
    const x = nbrLikes - nbrDislikes;
    const z = nbrReports;
  
    if (x <= 0) {
      return 0;
    } else if (z === 0) {
      return x;
    } else if (z > 0 && z <= 3) {
      return (2 * x - 3 * z) / 3;
    } else {
      return (2 * x - 3 * z) / z;
    }
  }

  return (
    <div style={{ textAlign: "center" }}  >
      <h3 className='h3' >
        Vos statistiques 📊
      </h3>
      
      <p >
        <b >Pour connaître vos<span className='h6'><br /> points forts 💪</span>  et <span className='h6'>points faibles 🤕</span></b>
      </p>
      <br />
      <br />
      <br />
      <div
        
        id="pie-chart" // Identifiant unique
        style={{
          ...chartSize,
          //border: "2px solid black", // Encadrement noir
          display: "flex",
          //marginLeft: "240px",
          justifyContent: "center", // Centre le graphique horizontalement
          alignItems: "center", // Centre le graphique verticalement
        }}
        ref={chartRef} // Référence pour l'encapsulation
      >
        <Pie data={data} />
      </div>
    </div>
  );
}

// Fonction pour générer le camembert en base64 avec html2canvas
export const generatePieChartBase64 = async () => {
  const chartElement = document.getElementById("pie-chart");
  const canvas = await html2canvas(chartElement); // Capturer le camembert
  return canvas.toDataURL("image/png"); // Retourner en base64
};

export default UserStats;