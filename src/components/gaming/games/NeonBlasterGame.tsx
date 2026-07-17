"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

const WIDTH = 540;
const HEIGHT = 420;
const PLAYER_W = 34;
const PLAYER_H = 26;
const BULLET_W = 4;
const BULLET_H = 14;
const ENEMY_W = 30;
const ENEMY_H = 30;
const STARTING_LIVES = 3;

const GAME_KEYS = new Set([
  "arrowleft",
  "arrowright",
  "arrowup",
  "a",
  "d",
  "w",
  " ",
]);

type Bullet = { x: number; y: number; id: number };
type Enemy = { x: number; y: number; id: number; speed: number; hue: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; hue: number };
type Keys = { left: boolean; right: boolean; shoot: boolean };

let entityId = 0;

function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function createInitialState() {
  return {
    playerX: WIDTH / 2 - PLAYER_W / 2,
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    particles: [] as Particle[],
    keys: { left: false, right: false, shoot: false } as Keys,
    lastShot: 0,
    spawnTimer: 0,
    running: true,
    invincibleUntil: 0,
    kills: 0,
    wave: 1,
  };
}

export function NeonBlasterGame() {
  const t = useTranslations("gaming");
  const { addScore } = useGamingMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [wave, setWave] = useState(1);
  const [kills, setKills] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);

  const stateRef = useRef(createInitialState());
  const livesRef = useRef(STARTING_LIVES);

  const endGame = useCallback(() => {
    stateRef.current.running = false;
    setGameOver(true);
  }, []);

  const loseLife = useCallback(() => {
    livesRef.current = Math.max(0, livesRef.current - 1);
    setLives(livesRef.current);
    if (livesRef.current === 0) {
      endGame();
    }
  }, [endGame]);

  const spawnEnemy = useCallback(() => {
    const state = stateRef.current;
    state.enemies.push({
      id: ++entityId,
      x: 20 + Math.random() * (WIDTH - ENEMY_W - 40),
      y: -ENEMY_H,
      speed: 1.8 + state.wave * 0.25 + Math.random() * 1.4,
      hue: Math.random() > 0.5 ? 300 : 180,
    });
  }, []);

  const explode = useCallback((x: number, y: number, hue: number) => {
    const state = stateRef.current;
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      const speed = 2 + Math.random() * 3;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        hue,
      });
    }
  }, []);

  const resetGame = useCallback(() => {
    stateRef.current = createInitialState();
    stateRef.current.invincibleUntil = performance.now() + 1200;
    livesRef.current = STARTING_LIVES;
    setLives(STARTING_LIVES);
    setGameOver(false);
    setKills(0);
    setWave(1);
  }, []);

  useEffect(() => {
    const clearKeys = () => {
      stateRef.current.keys = { left: false, right: false, shoot: false };
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!GAME_KEYS.has(key) && key !== " ") return;

      event.preventDefault();
      event.stopPropagation();

      if (["arrowleft", "a"].includes(key)) stateRef.current.keys.left = true;
      if (["arrowright", "d"].includes(key)) stateRef.current.keys.right = true;
      if (key === " " || key === "arrowup" || key === "w") {
        stateRef.current.keys.shoot = true;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowleft", "a"].includes(key)) stateRef.current.keys.left = false;
      if (["arrowright", "d"].includes(key)) stateRef.current.keys.right = false;
      if (key === " " || key === "arrowup" || key === "w") {
        stateRef.current.keys.shoot = false;
      }
    };

    const onBlur = clearKeys;
    const onVisibility = () => {
      if (document.hidden) clearKeys();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      clearKeys();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf = 0;

    const loop = (time: number) => {
      const state = stateRef.current;
      frame++;

      if (state.running && !document.hidden) {
        const moveSpeed = 4.8;
        if (state.keys.left) state.playerX -= moveSpeed;
        if (state.keys.right) state.playerX += moveSpeed;
        state.playerX = Math.max(8, Math.min(WIDTH - PLAYER_W - 8, state.playerX));

        if (state.keys.shoot && time - state.lastShot > 120) {
          state.lastShot = time;
          state.bullets.push({
            id: ++entityId,
            x: state.playerX + PLAYER_W / 2 - BULLET_W / 2,
            y: HEIGHT - PLAYER_H - 18,
          });
        }

        state.spawnTimer += 1;
        const spawnEvery = Math.max(18, 50 - state.wave * 5);
        if (state.spawnTimer >= spawnEvery) {
          state.spawnTimer = 0;
          spawnEnemy();
          if (state.wave > 2 && Math.random() > 0.5) spawnEnemy();
        }

        state.bullets = state.bullets
          .map((bullet) => ({ ...bullet, y: bullet.y - 8 }))
          .filter((bullet) => bullet.y > -BULLET_H);

        state.enemies = state.enemies.map((enemy) => ({
          ...enemy,
          y: enemy.y + enemy.speed,
        }));

        for (const bullet of [...state.bullets]) {
          for (const enemy of [...state.enemies]) {
            if (
              rectsOverlap(
                bullet.x,
                bullet.y,
                BULLET_W,
                BULLET_H,
                enemy.x,
                enemy.y,
                ENEMY_W,
                ENEMY_H,
              )
            ) {
              state.bullets = state.bullets.filter((b) => b.id !== bullet.id);
              state.enemies = state.enemies.filter((e) => e.id !== enemy.id);
              explode(enemy.x + ENEMY_W / 2, enemy.y + ENEMY_H / 2, enemy.hue);
              state.kills += 1;
              setKills(state.kills);
              addScore(35, t("blasterKill"));

              if (state.kills > 0 && state.kills % 8 === 0) {
                state.wave += 1;
                setWave(state.wave);
                addScore(100, t("blasterWave"));
              }
              break;
            }
          }
        }

        const playerY = HEIGHT - PLAYER_H - 10;
        if (time > state.invincibleUntil) {
          let hitThisFrame = false;

          for (const enemy of [...state.enemies]) {
            if (
              rectsOverlap(
                state.playerX,
                playerY,
                PLAYER_W,
                PLAYER_H,
                enemy.x,
                enemy.y,
                ENEMY_W,
                ENEMY_H,
              )
            ) {
              explode(state.playerX + PLAYER_W / 2, playerY + PLAYER_H / 2, 120);
              state.enemies = state.enemies.filter((e) => e.id !== enemy.id);
              loseLife();
              hitThisFrame = true;
              if (livesRef.current > 0) {
                state.invincibleUntil = time + 1600;
              }
              addScore(0, t("blasterHit"));
              break;
            }
          }

          // Only apply breach damage if we did not already take a hit this frame
          if (!hitThisFrame) {
            const fallen = state.enemies.filter((e) => e.y > HEIGHT);
            if (fallen.length > 0) {
              state.enemies = state.enemies.filter((e) => e.y <= HEIGHT);
              loseLife();
              if (livesRef.current > 0) {
                state.invincibleUntil = time + 1400;
              }
              addScore(0, t("blasterMiss"));
            }
          } else {
            state.enemies = state.enemies.filter((e) => e.y <= HEIGHT);
          }
        } else {
          state.enemies = state.enemies.filter((e) => e.y <= HEIGHT);
        }

        state.particles = state.particles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.04,
          }))
          .filter((p) => p.life > 0);
      }

      ctx.fillStyle = "#030308";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.strokeStyle = "rgba(57,255,20,0.1)";
      for (let x = 0; x < WIDTH; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
      }
      for (let y = (frame * 0.6) % 36; y < HEIGHT; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
      }

      for (const particle of state.particles) {
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 60%, ${particle.life})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const enemy of state.enemies) {
        ctx.fillStyle = `hsl(${enemy.hue}, 100%, 55%)`;
        ctx.shadowColor = `hsl(${enemy.hue}, 100%, 60%)`;
        ctx.shadowBlur = 14;
        ctx.fillRect(enemy.x, enemy.y, ENEMY_W, ENEMY_H);
        ctx.shadowBlur = 0;
      }

      for (const bullet of state.bullets) {
        ctx.fillStyle = "#39ff14";
        ctx.shadowColor = "#39ff14";
        ctx.shadowBlur = 12;
        ctx.fillRect(bullet.x, bullet.y, BULLET_W, BULLET_H);
        ctx.shadowBlur = 0;
      }

      const py = HEIGHT - PLAYER_H - 10;
      const invincible = time < state.invincibleUntil;
      if (state.running && (!invincible || frame % 10 < 5)) {
        ctx.fillStyle = invincible ? "#00f0ff" : "#39ff14";
        ctx.shadowColor = "#39ff14";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(state.playerX + PLAYER_W / 2, py);
        ctx.lineTo(state.playerX + PLAYER_W, py + PLAYER_H);
        ctx.lineTo(state.playerX, py + PLAYER_H);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (!state.running) {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#ff3864";
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "center";
        ctx.fillText(t("gameOver"), WIDTH / 2, HEIGHT / 2 - 8);
        ctx.fillStyle = "#39ff14";
        ctx.font = "12px monospace";
        ctx.fillText(`${t("kills")}: ${state.kills}`, WIDTH / 2, HEIGHT / 2 + 18);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [addScore, loseLife, explode, spawnEnemy, t]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[540px] items-center justify-between gap-3">
        <p className="gaming-pixel text-xs text-[#ffe600]">
          {t("wave")} {wave}
        </p>
        <p className="gaming-pixel text-xs text-[#39ff14]">
          {t("kills")}: {kills}
        </p>
        <p className="gaming-pixel text-xs text-[#ff3864]">
          {t("lives")}: {lives}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="gaming-blaster-canvas w-full max-w-[540px] rounded-xl border-2 border-[#39ff14]/40 shadow-[0_0_40px_rgba(57,255,20,0.15)]"
        aria-label={t("blasterTitle")}
      />

      <p className="gaming-pixel text-center text-[10px] leading-relaxed text-[#00f0ff] sm:text-xs">
        {t("blasterHint")}
      </p>

      {gameOver ? (
        <button type="button" onClick={resetGame} className="gaming-pixel text-sm text-[#39ff14]">
          {t("retry")}
        </button>
      ) : null}
    </div>
  );
}
