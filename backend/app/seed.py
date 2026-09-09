from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from .models import Situation


SEED_SITUATIONS = [
    {
        "title": "Discussion avec ma mère",
        "description": "Préparer une conversation sur les vacances et trouver un moment calme pour en parler.",
        "category": "relationship",
        "status": "active",
        "is_favorite": True,
    },
    {
        "title": "Entretien annuel",
        "description": "Faire le point sur les projets livrés, les apprentissages et les objectifs de l'année prochaine.",
        "category": "work",
        "status": "completed",
        "is_favorite": False,
    },
    {
        "title": "Désaccord avec Hugo",
        "description": "Revenir sur le malentendu de la semaine dernière sans repartir dans les reproches.",
        "category": "conflict",
        "status": "active",
        "is_favorite": True,
    },
    {
        "title": "Demander une augmentation",
        "description": "Rassembler des exemples concrets de responsabilités prises et préparer une demande réaliste.",
        "category": "assertiveness",
        "status": "draft",
        "is_favorite": True,
    },
    {
        "title": "Discussion difficile avec mon colocataire",
        "description": "Parler de la répartition des tâches ménagères et convenir d'une organisation simple.",
        "category": "relationship",
        "status": "active",
        "is_favorite": False,
    },
    {
        "title": "Prendre la parole en réunion",
        "description": "Présenter les premiers résultats du projet sans lire toutes les notes préparées.",
        "category": "work",
        "status": "completed",
        "is_favorite": False,
    },
    {
        "title": "Refuser une invitation",
        "description": "Répondre simplement que je ne suis pas disponible cette fois, sans inventer d'excuse.",
        "category": "assertiveness",
        "status": "draft",
        "is_favorite": False,
    },
    {
        "title": "Répondre à une critique",
        "description": "Écouter le retour jusqu'au bout, demander un exemple et décider de ce que j'en garde.",
        "category": "conflict",
        "status": "active",
        "is_favorite": True,
    },
    {
        "title": "Clarifier un message mal compris",
        "description": "Demander à Léa ce qu'elle a compris de mon message avant de justifier mon intention.",
        "category": "conflict",
        "status": "completed",
        "is_favorite": False,
    },
    {
        "title": "Dire non à une nouvelle tâche",
        "description": "Expliquer mes priorités actuelles et proposer de revoir le délai avec mon responsable.",
        "category": "work",
        "status": "draft",
        "is_favorite": True,
    },
    {
        "title": "Parler d'un sujet sensible avec mon partenaire",
        "description": "Choisir un moment où nous avons du temps et décrire ce que je ressens sans accusation.",
        "category": "relationship",
        "status": "active",
        "is_favorite": False,
    },
    {
        "title": "Présenter une idée au comité",
        "description": "Résumer l'idée en trois points et préparer les questions sur le budget.",
        "category": "work",
        "status": "draft",
        "is_favorite": False,
    },
    {
        "title": "Mettre une limite à un ami",
        "description": "Expliquer que les appels tardifs sont difficiles pour moi et proposer un autre créneau.",
        "category": "assertiveness",
        "status": "completed",
        "is_favorite": True,
    },
    {
        "title": "Réparer une conversation tendue",
        "description": "Reconnaître ma part dans l'échange et proposer de reprendre la discussion demain.",
        "category": "conflict",
        "status": "archived",
        "is_favorite": False,
    },
    {
        "title": "Organiser un déjeuner familial",
        "description": "Trouver une date qui convient à chacun et éviter de prendre seul toute la logistique.",
        "category": "relationship",
        "status": "active",
        "is_favorite": False,
    },
    {
        "title": "Demander de l'aide sur un dossier",
        "description": "Décrire précisément le point bloquant et demander trente minutes à un collègue.",
        "category": "work",
        "status": "completed",
        "is_favorite": False,
    },
    {
        "title": "Réagir à une remarque en public",
        "description": "Respirer avant de répondre et demander à poursuivre cette conversation en privé.",
        "category": "assertiveness",
        "status": "draft",
        "is_favorite": True,
    },
    {
        "title": "Partager une bonne nouvelle",
        "description": "Prendre le temps de raconter cette réussite à mes proches plutôt que de la minimiser.",
        "category": "relationship",
        "status": "completed",
        "is_favorite": False,
    },
    {
        "title": "Gérer un changement de planning",
        "description": "Vérifier les contraintes de chacun avant de confirmer la nouvelle organisation.",
        "category": "other",
        "status": "active",
        "is_favorite": False,
    },
    {
        "title": "Exprimer un besoin au travail",
        "description": "Formuler ce dont j'ai besoin pour avancer et préciser l'impact sur la livraison.",
        "category": "work",
        "status": "draft",
        "is_favorite": True,
    },
    {
        "title": "Faire connaissance avec une nouvelle équipe",
        "description": "Préparer quelques questions et ne pas chercher à tout retenir dès le premier jour.",
        "category": "work",
        "status": "completed",
        "is_favorite": False,
    },
    {
        "title": "Discuter d'argent avec un proche",
        "description": "Parler des dépenses partagées à partir de chiffres précis et écouter son point de vue.",
        "category": "relationship",
        "status": "active",
        "is_favorite": False,
    },
    {
        "title": "Recevoir un retour sur mon travail",
        "description": "Demander ce qui fonctionne déjà et choisir un ou deux axes concrets à travailler.",
        "category": "work",
        "status": "completed",
        "is_favorite": True,
    },
    {
        "title": "Demander un délai supplémentaire",
        "description": "Prévenir dès que possible, donner une nouvelle date et expliquer le compromis retenu.",
        "category": "assertiveness",
        "status": "archived",
        "is_favorite": False,
    },
    {
        "title": "Dire ce qui m'a blessé",
        "description": "Décrire un moment précis et l'effet qu'il a eu sur moi sans attribuer d'intention.",
        "category": "conflict",
        "status": "active",
        "is_favorite": True,
    },
    {
        "title": "Préparer un appel important",
        "description": "Noter l'objectif de l'appel et les deux décisions qui doivent être prises.",
        "category": "other",
        "status": "draft",
        "is_favorite": False,
    },
    {
        "title": "Inviter un voisin à discuter",
        "description": "Proposer un échange au sujet du bruit avec une formulation directe et respectueuse.",
        "category": "relationship",
        "status": "completed",
        "is_favorite": False,
    },
    {
        "title": "Répartir les responsabilités du projet",
        "description": "Lister les tâches restantes et demander à chacun de choisir une responsabilité claire.",
        "category": "work",
        "status": "active",
        "is_favorite": True,
    },
    {
        "title": "Répondre à une demande urgente",
        "description": "Vérifier si c'est vraiment prioritaire avant de modifier le planning de la journée.",
        "category": "assertiveness",
        "status": "draft",
        "is_favorite": False,
    },
    {
        "title": "Parler de mes attentes",
        "description": "Écrire ce que j'espère de cette relation et ce qui est important pour moi en ce moment.",
        "category": "relationship",
        "status": "active",
        "is_favorite": False,
    },
    {
        "title": "Faire le bilan d'un conflit",
        "description": "Identifier le déclencheur, ce qui a aidé et ce que je ferais différemment la prochaine fois.",
        "category": "conflict",
        "status": "completed",
        "is_favorite": True,
    },
    {
        "title": "Annoncer une décision",
        "description": "Partager la décision avec le contexte nécessaire et laisser un temps pour les questions.",
        "category": "work",
        "status": "archived",
        "is_favorite": False,
    },
    {
        "title": "Demander un retour après une présentation",
        "description": "Choisir une personne de confiance et demander un retour sur le fond comme sur la forme.",
        "category": "work",
        "status": "draft",
        "is_favorite": False,
    },
    {
        "title": "Exprimer mon désaccord calmement",
        "description": "Commencer par reconnaître le point d'accord puis expliquer la réserve que j'ai sur la proposition.",
        "category": "assertiveness",
        "status": "active",
        "is_favorite": True,
    },
    {
        "title": "S'excuser après un oubli",
        "description": "Reconnaître l'oubli, réparer ce qui peut l'être et éviter de me perdre dans les explications.",
        "category": "relationship",
        "status": "completed",
        "is_favorite": False,
    },
    {
        "title": "Préparer une négociation",
        "description": "Clarifier mes priorités, mes marges de manœuvre et les solutions acceptables pour chacun.",
        "category": "other",
        "status": "draft",
        "is_favorite": True,
    },
    {
        "title": "Faire face à une réunion imprévue",
        "description": "Prendre quelques minutes pour relire le contexte et arriver avec une question utile.",
        "category": "work",
        "status": "archived",
        "is_favorite": False,
    },
    {
        "title": "Partager une responsabilité familiale",
        "description": "Demander explicitement qui peut prendre en charge les prochaines étapes.",
        "category": "relationship",
        "status": "active",
        "is_favorite": False,
    },
    {
        "title": "Répondre à un message sec",
        "description": "Éviter de supposer l'intention et poser une question avant de répondre sur le même ton.",
        "category": "conflict",
        "status": "draft",
        "is_favorite": False,
    },
    {
        "title": "Parler de ma charge de travail",
        "description": "Présenter les tâches en cours, les échéances et les arbitrages qui deviennent nécessaires.",
        "category": "work",
        "status": "active",
        "is_favorite": True,
    },
    {
        "title": "Accueillir une nouvelle personne",
        "description": "Présenter les habitudes de l'équipe et vérifier comment elle préfère être accompagnée.",
        "category": "other",
        "status": "completed",
        "is_favorite": False,
    },
]


def seed_database(db: Session) -> None:
    if db.query(Situation).count() > 0:
        return

    now = datetime.utcnow()
    situations = [
        Situation(
            title=item["title"],
            description=item["description"],
            category=item["category"],
            status=item["status"],
            is_favorite=item["is_favorite"],
            created_at=now - timedelta(days=index),
            updated_at=now - timedelta(days=index),
        )
        for index, item in enumerate(SEED_SITUATIONS)
    ]
    db.add_all(situations)
    db.commit()
